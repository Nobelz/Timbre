import psycopg2

class Database:
    def __init__(self, host: str, database: str, user: str, password: str, port: int):
        self.connection = psycopg2.connect(
            host=host, 
            database=database, 
            user=user, 
            password=password,
            port=port)
        self.cursor = self.connection.cursor()

    def __del__(self):
        self.cursor.close()
        self.connection.close()

    def default_database():
        return Database("localhost", "timbre", "postgres", "postgres", 5434)

    def search_user_from_username(self, username: str):
        self.cursor.callproc('timbre.search_user_from_username', [username])
        return self.cursor.fetchone()

    def create_user(self, username: str):
        self.cursor.execute('CALL timbre.create_user(%s)', [username])
        self.connection.commit()
    
    def insert_song_profile(self, user_id: int, type_id: int, acousticness: float, danceability: float, energy: float, instrumentalness: float, liveness: float, loudness: float, speechiness: float, valence: float, tempo: float):
        self.cursor.execute('CALL timbre.insert_song_profile(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', [user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo])
        self.connection.commit()
    
    def get_top_ratings(self, user_id: int, limit: int):
        self.cursor.callproc('timbre.get_top_ratings', [user_id, limit])
        return self.cursor.fetchall()
    
    def make_rating(self, user_id: int, song_id: str, rating: float):
        self.cursor.execute('CALL timbre.make_rating(%s, %s, %s)', [user_id, song_id, rating])
        self.connection.commit()

    def get_song_profile(self, user_id: int, type_id: int, limit: int = 0):
        self.cursor.callproc('timbre.get_song_profile', [user_id, type_id, limit])
        return self.cursor.fetchall()
    
    def get_all_song_profiles(self, user_id: int, limit: int = 0):
        self.cursor.callproc('timbre.get_all_song_profiles', [user_id, limit])
        return self.cursor.fetchall()
