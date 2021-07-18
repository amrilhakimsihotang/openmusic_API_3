const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class MusicService {
  constructor() {
    this._pool = new Pool();
  }
 
  async addMusic({ title,year,performer,genre, duration }) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();
 
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt, insertedAt],
    };
 
    const result = await this._pool.query(query);
    
    if(result.rowCount=0){
      throw new InvariantError('data musik gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getMusic() {
    const result = await this._pool.query('SELECT id, title, performer FROM songs');
    return result.rows.map(mapDBToModel);
  }

  async getMusicById(id) {
    const query = {
     text: 'SELECT * FROM songs WHERE id = $1', values: [id]};
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Data musik tidak ditemukan');
    }
 
    return result.rows.map(mapDBToModel)[0];
  }

  async editMusicById(id, { title, year, performer, genre, duration }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, id]};
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui data musik. Id tidak ditemukan');
    }
  }

  async deleteMusicById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id', values: [id]};
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Data musik gagal dihapus. Id tidak ditemukan');
    }
  }
}


module.exports = MusicService;