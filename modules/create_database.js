module.exports = (connection)=>{
  connection.query("CREATE TABLE IF NOT EXISTS user (\
    id INT AUTO_INCREMENT PRIMARY KEY,\
    pseudo VARCHAR(255) NOT NULL,\
    email VARCHAR(255) NOT NULL,\
    password VARCHAR(255) NOT NULL,\
    creation_date DATETIME NOT NULL\
  );");

  connection.query("CREATE TABLE IF NOT EXISTS chanel (\
    id INT AUTO_INCREMENT PRIMARY KEY,\
    name VARCHAR(255) NOT NULL,\
    subject VARCHAR(255) NOT NULL,\
    owner INT NOT NULL,\
    position INT NOT NULL,\
    FOREIGN KEY (owner) REFERENCES user(id)\
  );");

  connection.query("CREATE TABLE IF NOT EXISTS message (\
    id INT AUTO_INCREMENT PRIMARY KEY,\
    sender INT NOT NULL,\
    date DATETIME NOT NULL,\
    text TEXT NOT NULL,\
    chanel INT NOT NULL,\
    FOREIGN KEY (sender) REFERENCES user(id),\
    FOREIGN KEY (chanel) REFERENCES chanel(id)\
  );")
  
}
