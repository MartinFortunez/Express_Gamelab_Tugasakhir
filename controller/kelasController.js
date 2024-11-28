var connection = require('../library/db');

const getAllkelas = function (req, res) {
    try {
        connection.query('SELECT * FROM kelas', function (err, rows) {
            if (err) {
                throw err;
            } else {
                res.json({
                    data: rows
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

const getKelasId = function (req, res) {
    try {
        let id = req.params.id;
        connection.query('SELECT * FROM kelas WHERE id =' + id, function (err, rows) {
            if (err) {
                throw err;
            } else {
                res.json({
                    data: rows
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

const createKelas = function (req, res) {
    try {
        let nama_jurusan = req.body.nama_jurusan;
        let Deskripsi = req.body.Deskripsi;
        let errors = false;

        if (!nama_jurusan || !Deskripsi) {
            throw new Error('Field nama_jurusan dan Deskripsi harus diisi');
        }

        let formData = {
            nama_jurusan: nama_jurusan,
            Deskripsi: Deskripsi
        }

        connection.query('INSERT INTO kelas SET ?', formData, function (err, result) {
            if (err) {
                throw err;
            } else {
                res.send('Data Berhasil Disimpan!');
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

const updateKelas = function (req, res) {
    try {
        let id = req.params.id;
        let nama_jurusan = req.body.nama_jurusan;
        let Deskripsi = req.body.Deskripsi;

        if (!nama_jurusan || !Deskripsi) {
            throw new Error('Field nama_jurusan dan Deskripsi tidak boleh kosong');
        }

        let formData = {
            nama_jurusan: nama_jurusan,
            Deskripsi: Deskripsi
        }

        connection.query('UPDATE kelas SET ? WHERE id = ' + id, formData, function (err, result) {
            if (err) {
                throw err;
            } else {
                res.send('Data Berhasil Diupdate!');
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

const deleteKelas = function (req, res) {
    try {
        let id = req.params.id;
        connection.query('DELETE FROM kelas WHERE id = ' + id, function (err, result) {
            if (err) {
                throw err;
            } else {
                res.send('Data Berhasil Dihapus!')
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    getAllkelas,
    getKelasId,
    createKelas,
    updateKelas,
    deleteKelas
}
