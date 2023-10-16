import psycopg2

connection = psycopg2.connect(
    host="localhost",
    database="timbre",
    user="postgres",
    password="postgres", # Password of postgres user, may need to change in the future
    port=5434)

cursor = connection.cursor()
cursor.execute("SELECT * FROM timbre.search_user_from_username('nobelzhou19@gmail.com');")
print(cursor.fetchone());

# TODO ADD timestamp to song_profiles