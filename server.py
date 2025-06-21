from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)
DB_FILE = 'db.json'

# Ensure DB file exists
if not os.path.exists(DB_FILE):
    with open(DB_FILE, 'w') as f:
        json.dump({'scripts': []}, f)

def read_db():
    with open(DB_FILE) as f:
        return json.load(f)

def write_db(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/scripts', methods=['GET'])
def get_scripts():
    data = read_db()
    return jsonify(data['scripts'])

@app.route('/scripts', methods=['POST'])
def add_script():
    new_script = request.json
    db = read_db()
    db['scripts'].append(new_script)
    write_db(db)
    return jsonify({"success": True}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
