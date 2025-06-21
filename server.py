from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory storage for simplicity. Replace with a database later.
scripts = []

@app.route('/')
def home():
    return 'Kairosploit Script Hub Backend is running!'

# POST /upload - Upload a new script
@app.route('/upload', methods=['POST'])
def upload_script():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    script = data.get('script')

    if not all([title, description, script]):
        return jsonify({'error': 'Missing fields'}), 400

    script_data = {
        'id': len(scripts) + 1,
        'title': title,
        'description': description,
        'script': script
    }

    scripts.append(script_data)

    return jsonify({'message': 'Script uploaded successfully', 'script': script_data}), 200

# GET /scripts - Return all uploaded scripts
@app.route('/scripts', methods=['GET'])
def get_scripts():
    return jsonify(scripts), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
