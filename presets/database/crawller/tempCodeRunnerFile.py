def generate_random_point():
  lat = random.uniform(-90.0, 90.0)
  lon = random.uniform(-180.0, 180.0)
  return f"POINT({lon} {lat})"