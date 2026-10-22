# -*- coding: utf-8 -*-
import asyncio
import asyncpg
import bcrypt

async def seed_e2e_users():
    conn = await asyncpg.connect(
        user="postgres",
        password="postgrespassword",
        database="uniresearch",
        host="127.0.0.1",
        port=5433
    )
    salt = bcrypt.gensalt(12)
    pwd_hash = bcrypt.hashpw(b"password123", salt).decode()
    
    # 1. Student User: นายธนภัทร สุวรรณโชติ (thanapat.suw@student.npru.ac.th)
    existing = await conn.fetchrow("SELECT id FROM users WHERE email = $1;", "thanapat.suw@student.npru.ac.th")
    if not existing:
        await conn.execute("""
            INSERT INTO users (email, hashed_password, role, first_name, last_name, student_id, department, is_active)
            VALUES ($1, $2, 'student', 'ธนภัทร', 'สุวรรณโชติ', '654259012', 'วิศวกรรมซอฟต์แวร์', true);
        """, "thanapat.suw@student.npru.ac.th", pwd_hash)
        print("Created student user: thanapat.suw@student.npru.ac.th")
    else:
        await conn.execute("""
            UPDATE users 
            SET hashed_password = $1, first_name = 'ธนภัทร', last_name = 'สุวรรณโชติ', student_id = '654259012', department = 'วิศวกรรมซอฟต์แวร์', is_active = true, role = 'student'
            WHERE email = $2;
        """, pwd_hash, "thanapat.suw@student.npru.ac.th")
        print("Reset student user: thanapat.suw@student.npru.ac.th")

    # Update s1@webmail.ac.th to also have valid password and same details
    s1_existing = await conn.fetchrow("SELECT id FROM users WHERE email = $1;", "s1@webmail.ac.th")
    if s1_existing:
        await conn.execute("""
            UPDATE users 
            SET hashed_password = $1, first_name = 'ธนภัทร', last_name = 'สุวรรณโชติ', student_id = '654259012', department = 'วิศวกรรมซอฟต์แวร์', is_active = true, role = 'student'
            WHERE email = $2;
        """, pwd_hash, "s1@webmail.ac.th")
        print("Reset s1@webmail.ac.th")

    # 2. Guest User: นางสาวพิมพ์ชนก รัตนากร (pimchanok.rat@gmail.com)
    existing_guest = await conn.fetchrow("SELECT id FROM users WHERE email = $1;", "pimchanok.rat@gmail.com")
    if not existing_guest:
        await conn.execute("""
            INSERT INTO users (email, hashed_password, role, first_name, last_name, is_active)
            VALUES ($1, $2, 'guest', 'พิมพ์ชนก', 'รัตนากร', true);
        """, "pimchanok.rat@gmail.com", pwd_hash)
        print("Created guest user: pimchanok.rat@gmail.com")
    else:
        await conn.execute("""
            UPDATE users 
            SET hashed_password = $1, first_name = 'พิมพ์ชนก', last_name = 'รัตนากร', role = 'guest', is_active = true
            WHERE email = $2;
        """, pwd_hash, "pimchanok.rat@gmail.com")
        print("Reset guest user: pimchanok.rat@gmail.com")

    await conn.close()
    print("Seed completed successfully.")

if __name__ == "__main__":
    asyncio.run(seed_e2e_users())
