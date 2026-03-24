# Perancangan Sistem Toram Interactive Novel

## 1. Struktur Data / State (Disimpan dalam JSON)

Untuk menghindari database pihak ketiga, kita akan menggunakan struktur JSON tunggal untuk menyimpan seluruh  *state* permainan.

```json
{
  "core_lore": "Sebuah artefak kuno hilang dari Guild Toram, artefak ini bisa mengendalikan monster...",
  "chapters": [
    "1. Pertemuan member di Sofya City untuk membahas rumor",
    "2. Pencarian informasi artefak ke NPC di El Scaro",
    "3. Ekspedisi pencarian lokasi artefak di dalam dungeon",
    "4. Kebenaran terungkap: ada pengkhianat",
    "5. Pembalasan dendam dan pertempuran akhir"
  ],
  "current_state": {
    "chapter_index": 0,
    "turn": 1, 
    "max_turns_per_chapter": 3,
    "status": "WAITING_GENERATION" 
  },
  "memory": [
    "Turn sebelumnya: Pahlawan A berhasil mengalahkan Minotaur dan menemukan jejak kaki."
  ],
  "novel_log": [
    "Babak 1, Bagian 1: Di tengah keramaian Sofya City, Rina... (teks narasi lengkap disimpan di sini agar bisa dibaca terus)"
  ],
  "player_pool": [
    {"ign": "Kael", "discord_id": "123", "backstory": "Mage api yang emosian"},
    {"ign": "Rina", "discord_id": "456", "backstory": "Tanker tangguh dari desa terpencil"}
  ],
  "active_quest": {
    "selected_players": [],
    "quest_desc": "",
    "reward": 0
  }
}
```

## 2. Alur Logika (Game Cycle)

1. **AI Generation (Pembuatan Cerita)**: Sistem membaca JSON, merandom 1-4 player dari `player_pool`, merandom jumlah Spina (500k-1m), dan mengirimkannya sebagai *Prompt* ke AI.
2. **Posting Quest**: Hasil dari AI (Cerita + Quest) di-posting (bisa dikirim via bot ke Discord atau ditampilkan di Web). Status game berubah menjadi `WAITING_VIDEO_PROOF`.
3. **Player Action (Bermain Toram)**: Player yang disebutkan di cerita bermain Toram, menyelesaikan misi, dan mengirimkan video bukti ke Discord.
4. **Admin Approval**: Admin mengecek video secara manual. Jika disetujui, Admin mengeklik tombol "Approve" (atau mengetik command).
5. **Progression Logic (Evaluasi Chapter)**:
   - Cerita utama (*narrative* dari AI) akan ditambahkan/di-`push` secara utuh ke dalam array `novel_log`. Dengan begini, Anda bisa mengambil seluruh isi `novel_log` dan menampilkannya di *website* atau *channel discord* sebagai novel bersambung yang bisa dibaca.
   - Ringkasan aksi/keberhasilan quest player akan dicatat ke dalam `memory` (skala ringkas saja untuk memori AI selanjutnya, agar hemat ukuran *prompt*).
   - Tambahkan `current_state.turn + 1`.
   - Jika `turn > max_turns_per_chapter` (misal sudah 3 event di chapter ini), maka pindah ke chapter selanjutnya: `chapter_index + 1` dan reset `turn` ke 1.
   - Jika belum melewati batas, tetap di chapter yang sama untuk event berikutnya.
   - Status kembali menjadi `WAITING_GENERATION`, dan siklus berulang.

## 3. Format Input (Prompt System ke AI)

```text
You are a Game Master for an interactive Toram Online Novel.

[CORE LORE]
{{core_lore}}

[CURRENT CHAPTER FOCUS]
{{current_chapter_description}} (Event {{turn}} of {{max_turn}})

[PREVIOUS MEMORY]
{{contextual_memory}}

[SELECTED PLAYERS FOR THIS QUEST]
{{selected_players_with_backstories}}

[INSTRUCTIONS]
1. Write the next continuation of the story (max 2-3 paragraphs). Keep it aligned with the Core Lore and Current Chapter Focus.
2. Incorporate the Selected Players into the narrative based on their backstory.
3. End the story with a specific IN-GAME QUEST for these players (e.g., farm 10 Minotaur Skins, defeat a specific boss in Toram).
4. Assign a random reward of {{random_spina}} Spina.
5. Return the result STRICTLY in JSON format.
```

## 4. Format Output (Yang dikeluarkan oleh AI)

AI diinstruksikan untuk selalu me-return format JSON yang mudah di-parsing oleh sistem web/bot Anda:

```json
{
  "narrative": "Di tengah keramaian Sofya City, Rina si tanker tangguh menyadari sebuah bayangan mengintai...",
  "quest_instruction": "Rina harus pergi ke Ruined Temple dan mengalahkan Minotaur (Normal/Hard) untuk mendapatkan informasi kemana pencuri itu lari.",
  "assigned_players": ["Rina"],
  "reward_spina": 650000
}
```