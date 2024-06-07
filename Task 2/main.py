from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_uploads import UploadSet, configure_uploads, IMAGES
from werkzeug.utils import secure_filename
import jwt
from datetime import datetime, timedelta
from functools import wraps
import pytz
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SECRET_KEY'] = 'ritesh'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['UPLOADED_FILES_DEST'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
db = SQLAlchemy(app)
ist = pytz.timezone('Asia/Kolkata')

files = UploadSet('files', IMAGES)
configure_uploads(app, files)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

def generate_token(username):
    payload = {
        'exp': datetime.now(ist) + timedelta(days=1),
        'iat': datetime.now(ist),
        'sub': username
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        token = token.replace('Bearer ', '')
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(username=data['sub']).first()
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except (jwt.InvalidTokenError, AttributeError):
            return jsonify({'message': 'Invalid token!'}), 401

        if not current_user:
            return jsonify({'message': 'User not found!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

@app.route('/', methods=['GET'])
def show_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        if rule.endpoint != 'static':
            routes.append({'endpoint': rule.endpoint, 'methods': ','.join(rule.methods), 'path': str(rule)})
    return jsonify({'routes': routes})

@app.route('/register', methods=['POST'])
def register():
    print("rr")
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    print(data)
    if not username or not password:
        return jsonify({'message': 'Username and password are required!'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists!'}), 400

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    token = generate_token(username)
    return jsonify({'message': 'User registered successfully', 'token': token})

@app.route('/login', methods=['POST'])
def login():
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return jsonify({'message': 'Username and password are required!'}), 401

    user = User.query.filter_by(username=auth.username).first()
    if not user or user.password != auth.password:
        return jsonify({'message': 'Invalid credentials!'}), 401

    token = generate_token(user.username)
    return jsonify({'message': 'User is now logged in', 'token': token})

@app.route('/refresh_token', methods=['POST'])
@token_required
def refresh_token(current_user):
    token = generate_token(current_user.username)
    return jsonify({'token': token})

@app.route('/images', methods=['POST'])
@token_required
def upload_image(current_user):
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file and files.file_allowed(file, file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOADED_FILES_DEST'], filename))
        new_image = Image(filename=filename, uploaded_by=current_user.id)
        db.session.add(new_image)
        db.session.commit()
        return jsonify({'message': 'Image uploaded successfully', 'filename': filename}), 200
    else:
        return jsonify({'message': 'Invalid file type'}), 400

@app.route('/images', methods=['GET'])
@token_required
def get_images(current_user):
    images = Image.query.filter_by(uploaded_by=current_user.id).all()
    images_list = [{'id': img.id, 'filename': img.filename} for img in images]
    return jsonify(images_list)

@app.route('/images/<int:image_id>', methods=['GET'])
@token_required
def get_image(current_user, image_id):
    image = Image.query.filter_by(id=image_id, uploaded_by=current_user.id).first()
    if not image:
        return jsonify({'message': 'Image not found'}), 404
    return send_file(os.path.join(app.config['UPLOADED_FILES_DEST'], image.filename), as_attachment=True)

@app.route('/images/<int:image_id>', methods=['PUT'])
@token_required
def update_image(current_user, image_id):
    image = Image.query.filter_by(id=image_id, uploaded_by=current_user.id).first()
    if not image:
        return jsonify({'message': 'Image not found'}), 404

    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file and files.file_allowed(file, file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOADED_FILES_DEST'], filename))
        os.remove(os.path.join(app.config['UPLOADED_FILES_DEST'], image.filename))  # delete old file
        image.filename = filename
        db.session.commit()
        return jsonify({'message': 'Image updated successfully', 'filename': filename}), 200
    else:
        return jsonify({'message': 'Invalid file type'}), 400

@app.route('/images/<int:image_id>', methods=['DELETE'])
@token_required
def delete_image(current_user, image_id):
    image = Image.query.filter_by(id=image_id, uploaded_by=current_user.id).first()
    if not image:
        return jsonify({'message': 'Image not found'}), 404
    os.remove(os.path.join(app.config['UPLOADED_FILES_DEST'], image.filename))
    db.session.delete(image)
    db.session.commit()
    return jsonify({'message': 'Image deleted successfully'}), 200

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOADED_FILES_DEST']):
        os.makedirs(app.config['UPLOADED_FILES_DEST'])
    db.create_all()
    app.run(debug=True)
