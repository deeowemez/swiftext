CREATE TABLE
    IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        userID VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        userID VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        filepath VARCHAR(255) NOT NULL,
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tag VARCHAR(255),
        mod_filepath VARCHAR(255) NOT NULL,
        CONSTRAINT fk_user FOREIGN KEY (userID) REFERENCES users (userID) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS highlights (
        id SERIAL PRIMARY KEY,
        file_id INT NOT NULL,
        filepath VARCHAR(255) NOT NULL,
        highlights JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_file FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE
    );

CREATE INDEX idx_file_userid ON files (userID);
CREATE INDEX idx_highlight_fileid ON highlights (file_id);
