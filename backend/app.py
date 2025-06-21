from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
from dotenv import load_dotenv
import certifi
from datetime import datetime, timedelta
import json
import logging
from bson import ObjectId
import google.generativeai as genai
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, verify_jwt_in_request
import bcrypt
from routes.auth_routes import auth_routes
from routes.graph_routes import graph_routes
from routes.user_routes import user_routes
from routes.payment_routes import payment_routes
from routes.chatRoutes import chat_bp as chat_routes
import razorpay

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "https://nexoraz-hiclpts0w-rohits-projects-bdcce9d1.vercel.app/" 
        ],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Authorization"],
        "supports_credentials": True
    }
})

# Get database password from environment variable
db_password = os.getenv('MONGODB_PASSWORD')
if not db_password:
    raise ValueError("MONGODB_PASSWORD environment variable is not set")

# MongoDB connection URI
uri = "mongodb+srv://rohitkumarprajapat0:graph123%40@graph.4so8e.mongodb.net/?retryWrites=true&w=majority"

# Create MongoDB client
try:
    client = MongoClient(
        uri,
        tlsCAFile=certifi.where()
    )
    # Test connection
    client.admin.command('ping')
    logger.info("Successfully connected to MongoDB!")
    db = client['knowledge_graph_db']
except Exception as e:
    logger.error(f"Error connecting to MongoDB: {e}")
    raise

# After MongoDB connection is established
app.config['DATABASE'] = db

# Configure Gemini
try:
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
    
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    logger.info("Gemini API configured successfully")
except Exception as e:
    logger.error(f"Failed to configure Gemini: {e}")
    model = None

# Add JWT configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
jwt = JWTManager(app)

# Add Razorpay configurations
app.config['RAZORPAY_KEY_ID'] = os.getenv('RAZORPAY_KEY_ID')
app.config['RAZORPAY_KEY_SECRET'] = os.getenv('RAZORPAY_KEY_SECRET')

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(os.getenv('RAZORPAY_KEY_ID'), os.getenv('RAZORPAY_KEY_SECRET'))
)

# Add this to check if Razorpay is properly initialized
try:
    razorpay_client.order.all()  # Test API connection
    print("Razorpay client initialized successfully")
except Exception as e:
    print(f"Error initializing Razorpay client: {str(e)}")

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
        return response

@app.before_request
def check_auth():
    if request.endpoint and 'api' in request.endpoint and 'auth' not in request.endpoint:
        try:
            verify_jwt_in_request()
        except Exception as e:
            return jsonify({"msg": "Invalid token"}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        users = db.users
        
        # Check if user already exists
        if users.find_one({'email': data['email']}):
            return jsonify({'error': 'User already exists'}), 400
        
        # Hash password
        hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user = {
            'username': data['username'],
            'email': data['email'],
            'password': hashed,
            'created_at': datetime.utcnow()
        }
        
        result = users.insert_one(user)
        user['_id'] = str(result.inserted_id)
        
        # Create access token
        access_token = create_access_token(identity=str(result.inserted_id))
        
        return jsonify({
            'message': 'User registered successfully',
            'token': access_token,
            'user': {
                'id': str(result.inserted_id),
                'username': user['username'],
                'email': user['email']
            }
        }), 201
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        user = db.users.find_one({'email': data['email']})
        
        if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
            access_token = create_access_token(
                identity=str(user['_id']),
                expires_delta=timedelta(days=1)
            )
            return jsonify({
                'token': access_token,
                'user': {
                    'id': str(user['_id']),
                    'username': user['username'],
                    'email': user['email']
                }
            })
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({'error': 'Login failed'}), 500

@app.route('/api/graphs', methods=['GET'])
@jwt_required()
def get_graphs():
    try:
        current_user_id = get_jwt_identity()
        graphs = list(db.graphs.find({'user_id': current_user_id}))
        for graph in graphs:
            graph['_id'] = str(graph['_id'])
        return jsonify({'graphs': graphs})
    except Exception as e:
        logger.error(f"Error fetching graphs: {e}")
        return jsonify({'graphs': [], 'error': str(e)}), 500

@app.route('/api/graphs', methods=['POST'])
@jwt_required()
def create_graph():
    try:
        current_user_id = get_jwt_identity()
        data = request.json
        title = data['title']
        description = data['description']

        if not model:
            logger.warning("Gemini model not available - falling back to basic graph")
            graph = create_basic_graph(title, description)
        else:
            try:
                # Prompt for Gemini
                prompt = f"""
                Create a detailed knowledge graph about "{title}". Context: {description}

                Return a JSON object with this structure:
                {{
                    "nodes": [
                        {{
                            "id": "string",
                            "label": "string",
                            "type": "main/concept/feature",
                            "description": "detailed explanation"
                        }}
                    ],
                    "edges": [
                        {{
                            "source": "node_id",
                            "target": "node_id",
                            "label": "relationship description"
                        }}
                    ]
                }}

                Requirements:
                1. Main node (id: "0") should be "{title}"
                2. Include at least 6 related concept nodes
                3. Include at least 4 feature nodes
                4. All nodes must have detailed descriptions
                5. Create meaningful relationships between nodes
                6. Ensure all node IDs referenced in edges exist in nodes array

                Make it educational and interconnected.
                Return ONLY valid JSON, no other text.
                """

                response = model.generate_content(prompt)
                response_text = response.text.strip()
                
                # Clean the response text
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]
                
                generated_data = json.loads(response_text)
                logger.info(f"Generated graph data successfully")

                if not generated_data.get('nodes') or not generated_data.get('edges'):
                    raise ValueError("Generated data missing nodes or edges")

                graph = {
                    'title': title,
                    'description': description,
                    'nodes': generated_data['nodes'],
                    'edges': generated_data['edges'],
                    'created_at': datetime.utcnow(),
                    'user_id': current_user_id
                }
                logger.info(f"Created graph with {len(graph['nodes'])} nodes and {len(graph['edges'])} edges")

            except Exception as e:
                logger.error(f"Gemini graph generation failed: {e}")
                graph = create_basic_graph(title, description)

        graph['user_id'] = current_user_id  # Add user_id to graph
        result = db.graphs.insert_one(graph)
        graph['_id'] = str(result.inserted_id)
        return jsonify(graph), 201

    except Exception as e:
        logger.error(f"Error creating graph: {e}")
        return jsonify({'error': str(e)}), 500

def create_basic_graph(title, description):
    """Create a detailed knowledge graph structure based on topic"""
    # Common node types for any topic
    nodes = [
        {
            'id': '0',
            'label': title,
            'type': 'main',
            'description': description
        }
    ]
    edges = []
    
    # Add topic-specific nodes based on keywords
    title_lower = title.lower()
    
    if any(word in title_lower for word in ['india', 'country', 'nation']):
        # Template for countries
        nodes.extend([
            {
                'id': '1',
                'label': 'Culture',
                'type': 'concept',
                'description': 'Cultural heritage and traditions'
            },
            {
                'id': '2',
                'label': 'Geography',
                'type': 'feature',
                'description': 'Physical and political geography'
            },
            {
                'id': '3',
                'label': 'Economy',
                'type': 'concept',
                'description': 'Economic system and development'
            },
            {
                'id': '4',
                'label': 'History',
                'type': 'concept',
                'description': 'Historical events and timeline'
            },
            {
                'id': '5',
                'label': 'Government',
                'type': 'feature',
                'description': 'Political system and governance'
            },
            {
                'id': '6',
                'label': 'Education',
                'type': 'feature',
                'description': 'Educational system and institutions'
            }
        ])
        edges.extend([
            {'source': '0', 'target': '1', 'label': 'encompasses'},
            {'source': '0', 'target': '2', 'label': 'located in'},
            {'source': '0', 'target': '3', 'label': 'drives'},
            {'source': '0', 'target': '4', 'label': 'shaped by'},
            {'source': '0', 'target': '5', 'label': 'governed by'},
            {'source': '0', 'target': '6', 'label': 'develops through'},
            {'source': '1', 'target': '4', 'label': 'influenced by'},
            {'source': '3', 'target': '5', 'label': 'regulated by'},
            {'source': '6', 'target': '3', 'label': 'contributes to'}
        ])
    elif any(word in title_lower for word in ['technology', 'software', 'programming']):
        # Template for technology topics
        nodes.extend([
            {
                'id': '1',
                'label': 'Applications',
                'type': 'feature',
                'description': 'Practical applications and use cases'
            },
            {
                'id': '2',
                'label': 'Components',
                'type': 'concept',
                'description': 'Key components and elements'
            },
            {
                'id': '3',
                'label': 'Development',
                'type': 'feature',
                'description': 'Development process and tools'
            },
            {
                'id': '4',
                'label': 'Benefits',
                'type': 'concept',
                'description': 'Advantages and benefits'
            },
            {
                'id': '5',
                'label': 'Challenges',
                'type': 'concept',
                'description': 'Limitations and challenges'
            }
        ])
        edges.extend([
            {'source': '0', 'target': '1', 'label': 'enables'},
            {'source': '0', 'target': '2', 'label': 'consists of'},
            {'source': '0', 'target': '3', 'label': 'requires'},
            {'source': '0', 'target': '4', 'label': 'provides'},
            {'source': '0', 'target': '5', 'label': 'faces'},
            {'source': '2', 'target': '3', 'label': 'used in'},
            {'source': '4', 'target': '1', 'label': 'enhances'}
        ])
    else:
        # Generic template for other topics
        nodes.extend([
            {
                'id': '1',
                'label': 'Key Features',
                'type': 'concept',
                'description': f'Main characteristics of {title}'
            },
            {
                'id': '2',
                'label': 'Applications',
                'type': 'feature',
                'description': f'How {title} is applied'
            },
            {
                'id': '3',
                'label': 'Components',
                'type': 'concept',
                'description': f'Major components of {title}'
            },
            {
                'id': '4',
                'label': 'Impact',
                'type': 'feature',
                'description': f'Effects and influence of {title}'
            }
        ])
        edges.extend([
            {'source': '0', 'target': '1', 'label': 'has'},
            {'source': '0', 'target': '2', 'label': 'used in'},
            {'source': '0', 'target': '3', 'label': 'consists of'},
            {'source': '0', 'target': '4', 'label': 'creates'},
            {'source': '1', 'target': '2', 'label': 'enables'},
            {'source': '3', 'target': '4', 'label': 'influences'}
        ])

    return {
        'title': title,
        'description': description,
        'nodes': nodes,
        'edges': edges,
        'created_at': datetime.utcnow()
    }

@app.route('/api/graphs/<graph_id>', methods=['GET'])
@jwt_required()
def get_graph(graph_id):
    try:
        current_user_id = get_jwt_identity()
        graph = db.graphs.find_one({
            '_id': ObjectId(graph_id),
            'user_id': current_user_id
        })
        if graph:
            graph['_id'] = str(graph['_id'])
            return jsonify(graph)
        return jsonify({'error': 'Graph not found'}), 404
    except Exception as e:
        logger.error(f"Error fetching graph: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/graphs/<graph_id>', methods=['DELETE'])
@jwt_required()
def delete_graph(graph_id):
    try:
        current_user_id = get_jwt_identity()
        result = db.graphs.delete_one({
            '_id': ObjectId(graph_id),
            'user_id': current_user_id
        })
        if result.deleted_count:
            return jsonify({'message': 'Graph deleted successfully'}), 200
        return jsonify({'error': 'Graph not found'}), 404
    except Exception as e:
        logger.error(f"Error deleting graph: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        current_user_id = get_jwt_identity()
        user = db.users.find_one({'_id': ObjectId(current_user_id)})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email']
        })
    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    try:
        current_user_id = get_jwt_identity()
        data = request.json
        
        # Find user
        user = db.users.find_one({'_id': ObjectId(current_user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        # Update fields
        update_data = {}
        if 'username' in data:
            update_data['username'] = data['username']
        if 'email' in data:
            update_data['email'] = data['email']
            
        if update_data:
            db.users.update_one(
                {'_id': ObjectId(current_user_id)},
                {'$set': update_data}
            )
            
        # Get updated user
        updated_user = db.users.find_one({'_id': ObjectId(current_user_id)})
        return jsonify({
            'id': str(updated_user['_id']),
            'username': updated_user['username'],
            'email': updated_user['email']
        })
    except Exception as e:
        logger.error(f"Error updating user profile: {e}")
        return jsonify({'error': str(e)}), 500

# Register blueprints
app.register_blueprint(auth_routes)
app.register_blueprint(graph_routes)
app.register_blueprint(user_routes)
app.register_blueprint(payment_routes)
app.register_blueprint(chat_routes)

if __name__ == '__main__':
    try:
        # Test MongoDB connection
        client.admin.command('ping')
        logger.info("Connected to MongoDB successfully!")
        
        # Run Flask app
        logger.info("Starting Flask server on http://localhost:5000")
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        logger.error(f"Startup Error: {e}")
        raise