from datetime import datetime

def create_user_document(username, email, hashed_password):
    return {
        'username': username,
        'email': email,
        'password': hashed_password,
        'is_premium': False,
        'graphs_created_today': 0,
        'last_graph_date': datetime.utcnow(),
        'created_at': datetime.utcnow()
    } 