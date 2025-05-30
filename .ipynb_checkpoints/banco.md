CREATE DATABASE IF NOT EXISTS humor_alunos_sabriny;
USE humor_alunos_sabriny;

CREATE TABLE IF NOT EXISTS humor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    humor VARCHAR(20) NOT NULL,
    comentario VARCHAR(200),
    tipo ENUM('basico', 'detalhado') NOT NULL,
    nota DECIMAL(4,2) DEFAULT NULL
);
