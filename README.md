# Easeestate-Project

EaseEstate - Real Estate Listing Platform
HOW TO RUN

1. Clone the repository (or download the project folder).
2. Create a virtual environment (optional but recommended):
   > python -m venv venv

3. Activate the virtual environment:
   On Windows:
   > venv\Scripts\activate

   On macOS/Linux:
   > source venv/bin/activate

4. Install required packages:
   > pip install -r requirements.txt

5. Set the FLASK_APP environment variable:
   On Windows:
   > set FLASK_APP=app

   On macOS/Linux:
   > export FLASK_APP=app

6. Initialize the database (if not already created):
   > flask init-db

7. Run the Flask application:
   > flask run

8. Open your browser and go to:
   http://127.0.0.1:5000/



PROJECT FEATURES

- User Registration & Login
- Post Property for Sale or Rent
- View Properties by Buy/Rent Category
- Chat Between Buyers and Sellers (message saved to DB)
- Property Image Upload & Slider
- User Dashboard (My Ads, Profile Info)
Database used: SQLite  
Backend Framework: Flask  
Frontend: HTML/CSS/JavaScript

- Ensure your database is initialized before first run.
- All uploaded images should go into the /uploads folder.
- If logged in, users can message sellers from the property detail page.



