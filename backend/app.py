from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Get database password from environment variable
db_password = os.getenv('MONGODB_PASSWORD')
if not db_password:
    raise ValueError("MONGODB_PASSWORD environment variable is not set")

# URL encode the password
encoded_password = quote_plus(db_password)

uri = f"mongodb+srv://rohitkumarprajapat0:{encoded_password}@graph.4so8e.mongodb.net/?retryWrites=true&w=majority&appName=graph"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['knowledge_graph_db']

# API Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    users = db.users
    
    # Check if user already exists
    if users.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists'}), 400
    
    # Hash password here (using bcrypt in production)
    users.insert_one({
        'username': data['username'],
        'email': data['email'],
        'password': data['password']  # Remember to hash in production
    })
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = db.users.find_one({
        'email': data['email'],
        'password': data['password']  # Remember to hash in production
    })
    
    if user:
        return jsonify({
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email']
        })
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/graphs', methods=['GET'])
def get_graphs():
    graphs = list(db.graphs.find())
    for graph in graphs:
        graph['_id'] = str(graph['_id'])
    return jsonify(graphs)

@app.route('/api/graphs', methods=['POST'])
def create_graph():
    data = request.json
    result = db.graphs.insert_one({
        'title': data['title'],
        'description': data['description'],
        'nodes': [],
        'edges': []
    })
    return jsonify({'id': str(result.inserted_id)}), 201

if __name__ == '__main__':
    try:
        # Test MongoDB connection
        client.admin.command('ping')
        print("Connected to MongoDB successfully!")
        # Run Flask app
        app.run(debug=True)
    except Exception as e:
        print(f"Error: {e}")