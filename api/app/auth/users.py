from __future__ import annotations

HARDCODED_USERS: dict[str, dict] = {
    "owner":      {"id": 1, "name": "Pemilik Tambang",        "role": "owner",      "role_en": "Owner / Management",       "initials": "OW", "password": "owner"},
    "ktt":        {"id": 2, "name": "Kepala Teknik Tambang",  "role": "ktt",        "role_en": "KTT / Mine Manager",        "initials": "KT", "password": "ktt"},
    "surveyor":   {"id": 3, "name": "Surveyor",               "role": "surveyor",   "role_en": "Surveyor",                  "initials": "SV", "password": "surveyor"},
    "planner":    {"id": 4, "name": "Mine Plan Engineer",     "role": "planner",    "role_en": "Mine Plan Engineer",        "initials": "MP", "password": "planner"},
    "dispatcher": {"id": 5, "name": "Dispatcher",             "role": "dispatcher", "role_en": "Dispatcher / Operasi",      "initials": "DS", "password": "dispatcher"},
    "geotech":    {"id": 6, "name": "Geotech Engineer",       "role": "geotech",    "role_en": "Geotech Engineer",          "initials": "GT", "password": "geotech"},
    "land":       {"id": 7, "name": "Tim Pembebasan Lahan",   "role": "land",       "role_en": "Tim Pembebasan Lahan",      "initials": "LA", "password": "land"},
    "legal":      {"id": 8, "name": "Tim Legal & Perizinan",  "role": "legal",      "role_en": "Tim Legal & Perizinan",     "initials": "LG", "password": "legal"},
    "auditor":    {"id": 9, "name": "Inspektur/Auditor",      "role": "auditor",    "role_en": "Inspektur / Auditor",       "initials": "AU", "password": "auditor"},
}
