const config = require('./config.json');
const mongodbUri = config['database']['development']['uri'];
const client = require('mongodb').MongoClient();

function dbConnect() {
    return new Promise((resolve, reject) => {
        client.connect(mongodbUri, (err, database) => {
            if (err) { console.log("Connected to mongodb server failed"); reject(err); }
            else resolve(database)
        });
    });
}
const requestResponse = {
    common_success: {
        success: true,
        rc: '0000',
        rm: 'Berhasil memuat permintaan'
    }
    ,signup_success: {
        success: true,
        rc: '0000',
        rm: 'Berhasil Melakukan Pendaftaran,Selamat Bergabung :), Silahkan Melakukan Login Untuk Menggunakan Aplikasi'
    }
    ,register_leader_success: {
        success: true,
        rc: '0000',
        rm: 'Berhasil mendaftarkan leader'
    }
    ,common_create_success: {
        success: true,
        rc: '0000',
        rm: 'Berhasil menyimpan data'
    },
    common_delete_success: {
        success: true,
        rc: '0000',
        rm: 'Berhasil menghapus data'
    },
    common_update_success: {
        success: true,
        rc: '0000',
        rm: 'Berhasil mengubah data'
    },
    common_success_simple: {
        success: true,
        rc: '0000',
        rm: 'Berhasil memuat permintaan'
    },
    common_error: {
        success: false,
        rc: '5000',
        rm: 'Server tidak merespon, silahkan hubungi call center untuk info lebih lanjut'
    },
    body_incomplte: {
        success: false,
        rc: '0001',
        rm: 'Parameter tidak lengkap'
    },
    email_already_use: {
        success: false,
        rc: '0011',
        rm: 'Email sudah digunakan'
    },
    phone_number_already_use: {
        success: false,
        rc: '0012',
        rm: 'Nomor telepon telah digunakan'
    },
    username_already_use: {
        success: false,
        rc: '0013',
        rm: 'Username telah digunakan'
    },
    reference_code_not_found: {
        success: false,
        rc: '0014',
        rm: 'Kode Referensi Tidak Terdaftar'
    },
    identification_number_already_use: {
        success: false,
        rc: '0014',
        rm: 'Nomor KTP telah digunakan'
    },
    access_denied: {
        success: false,
        rc: '0015',
        rm: 'Anda tidak mempunyai hak akses untuk menggunakan fitur ini'
    },
    verification_code_invalid: {
        success: false,
        rc: '0021',
        rm: 'Kode verifikasi tidak valid'
    },
    account_not_found: {
        success: false,
        rc: '0022',
        rm: 'Akun tidak terdaftar atau password tidak sesuai'
    },
    account_not_verified_by_admin: {
        success: false,
        rc: '0223',
        rm: 'Akun Anda belum terverifikasi, silahkan hubungi admin untuk melakukan verifikasi'
    },
    account_not_admin: {
        success: false,
        rc: '0224',
        rm: 'akun bukan admin'
    },
    account_not_verified_email: {
        success: false,
        rc: '0023',
        rm: 'Akun Anda belum terverifikasi, silahkan cek email Anda untuk mengaktifkan akun'
    },
    account_not_verified_phone: {
        success: false,
        rc: '0024',
        rm: 'Akun Anda belum terverifikasi, silahkan cek kode verifikasi yang kami kirim ke nomor Anda'
    },
    account_need_phone_verification: {
        success: false,
        rc: '0026',
        rm: 'Fitur ini membutuhkan nomor telepon pengguna yang valid, update profile Anda untuk melanjutkan'
    },
    account_already_login: {
        success: false,
        rc: '0025',
        rm: 'Anda telah masuk sebelumnya menggunakan perangkat '
    },
    class_already_taken: {
        success: false,
        rc: '0027',
        rm: 'Anda Telah Mengikuti Kelas'
    },
    class_not_exist: {
        success: false,
        rc: '0028',
        rm: 'Kelas tidak terdaftar'
    },
    token_invalid: {
        success: false,
        rc: '0030',
        rm: 'Akses ditolak! Sesi Anda telah berakhir atau tidak valid'
    },
    angkot_trip_have_active_trip: {
        success: false,
        rc: '0040',
        rm: 'Anda masih memiliki perjalanan yang masih aktif (pending/on trip)'
    },
    angkot_failed_cancel_trip: {
        success: false,
        rc: '0041',
        rm: 'Gagal membatalkan pesanan, ID perjalanan tidak sesuai'
    },
    angkot_tripid_invalid: {
        success: false,
        rc: '0042',
        rm: 'ID perjalanan tidak sesuai'
    },
    angkot_failed_assign_trip: {
        success: false,
        rc: '0043',
        rm: 'Gagal assign perjalanan, check kembali trip id dan plat id yang Anda kirimkan'
    }, angkot_failed_change_state: {
        success: false,
        rc: '0046',
        rm: 'Gagal mengubah status angkot, angkot tidak ditemukan atau state tidak valid'
    },
    angkot_not_found: {
        success: false,
        rc: '0044',
        rm: 'Angkot tidak ditemukan'
    },
    already_vote: {
        success: false,
        rc: '0050',
        rm: 'Anda telah melakukan vote sebelumnya'
    },
    already_submit_task_answer: {
        success: false,
        rc: '0051',
        rm: 'Anda telah mengumpulkan tugas ini, silahkan melakukan update jika ingin mengubah jawaban'
    }
};
const activities = {
    create_material: {
        content_code: 1,
        content: 'Materi',
        activity_code: 0,
        activity_text: 'Membuat',
        desc: 'Membuat materi ',
    },
    upvote_material: {
        content_code: 1,
        content: 'Materi',
        activity_code: 2,
        activity_text: 'Upvote',
        desc: 'Upvote materi ',
    },downvote_material: {
        content_code: 1,
        content: 'Materi',
        activity_code: 3,
        activity_text: 'Downvote',
        desc: 'Downvote materi ',
    },favourite_material: {
        content_code: 1,
        content: 'Materi',
        activity_code: 4,
        activity_text: 'Favourite',
        desc: 'Favourite materi '
    },
    create_news: {
        content_code: 2,
        content: 'Berita',
        activity_code: 0,
        activity_text: 'Membuat',
        desc: 'Membuat berita ',
    },
    upvote_news: {
        content_code: 2,
        content: 'Berita',
        activity_code: 2,
        activity_text: 'Upvote',
        desc: 'Upvote Berita ',
    },downvote_news: {
        content_code: 2,
        content: 'Berita',
        activity_code: 3,
        activity_text: 'Downvote',
        desc: 'Downvote Berita ',
    },favourite_news: {
        content_code: 2,
        content: 'Berita',
        activity_code: 4,
        activity_text: 'Favourite',
        desc: 'Favourite Berita '
    },
    create_forum: {
        content_code: 3,
        content: 'Forum',
        activity_code: 0,
        activity_text: 'Membuat',
        desc: 'Membuat forum ',
    },answer_forum: {
        content_code: 3,
        content: 'Forum',
        activity_code: 1,
        activity_text: 'Menjawab',
        desc: 'Menjawab Forum ',
    },upvote_forum: {
        content_code: 3,
        content: 'Forum',
        activity_code: 2,
        activity_text: 'Upvote',
        desc: 'Upvote Forum ',
    },downvote_forum: {
        content_code: 3,
        content: 'Forum',
        activity_code: 3,
        activity_text: 'Downvote',
        desc: 'Downvote Forum ',
    },favourite_forum: {
        content_code: 3,
        content: 'Forum',
        activity_code: 4,
        activity_text: 'Favourite',
        desc: 'Favourite Forum '
    },
    create_comment: {
        content_code: 4,
        content: 'Komentar',
        activity_code: 0,
        activity_text: 'Membuat',
        desc: 'Membuat komentar ',
    },answer_comment: {
        content_code: 4,
        content: 'Komentar',
        activity_code: 1,
        activity_text: 'Upvote',
        desc: 'Upvote Komentar ',
    },upvote_comment: {
        content_code: 4,
        content: 'Komentar',
        activity_code: 2,
        activity_text: 'Upvote',
        desc: 'Upvote Komentar ',
    },downvote_comment: {
        content_code: 4,
        content: 'Komentar',
        activity_code: 3,
        activity_text: 'Downvote',
        desc: 'Downvote Komentar ',
    },favourite_comment: {
        content_code: 4,
        content: 'Komentar',
        activity_code: 4,
        activity_text: 'Favourite',
        desc: 'Favourite Komentar '
    }
};
const sorter = {
    date_descending:{
        created_at:-1
    },upvote_descending:{
        upvote:-1
    },downvote_descending:{
        downvote:-1
    },favorite_descending:{
        favorite:-1
    },comment_descending:{
        comment:-1
    }
};
const poins = {
    create_material:3,
    delete_material:-3,
    upvote:1,
    downvote:-1,
    favorite:1,
    defavorite:1,
};
const points = {
    answer_forum:1
};
const colors = [
    "#E52B50",
    "#FFBF00",
    "#9966CC",
    '#FBCEB1',
    '#7FFFD4',
    '#007FFF',
    '#89CFF0',
    '#F5F5DC',
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
];
module.exports={sorter,requestResponse,dbConnect,activities,points,poins,colors};