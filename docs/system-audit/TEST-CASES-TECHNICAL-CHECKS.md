# จุดตรวจ API ฐานข้อมูล และไฟล์ประกอบกรณีทดสอบ UniResearch

ฉบับคู่กับ [TEST-CASES.md](TEST-CASES.md) วันที่ 16 ตุลาคม 2026 ส่วนนี้เก็บ request, response, validation, RBAC, counters และ persistence ที่พิสูจน์ด้วยการกดหน้าเว็บอย่างเดียวไม่ได้ ใช้ TC ID เดียวกันและข้อมูล CSV ตามข้อ 1.2 ของ Test Cases; ห้ามนับผล UI แทน assertions ด้านล่าง

ชื่องาน/หมวดหมู่ปัจจุบันอ้าง [แหล่งข้อมูลผลงานจาก migration](TEST-RESEARCH-DATA.md) เลข 5 และชื่อที่มีวงเล็บสำเนาเป็นข้อมูลเตรียมเพิ่ม สถานะ/ผู้เกี่ยวข้อง/keyword เฉพาะกรณีเป็นค่าควบคุมตามแผน ไม่ใช่ข้อเท็จจริงความเป็นผู้แต่งของบุคคล CSV; การทดสอบครั้งใหม่นี้ยังไม่ได้ execute

รหัสผ่านสำหรับสำเนาฐานทดสอบฉบับนี้กำหนดเป็น `UniResearchTest2026!` ก่อนเริ่ม ไม่ใช่รหัสผ่านจาก CSV หรือรหัสบัญชีใช้งานจริง สคริปต์/ผลย้อนหลังยังไม่ได้รันชุด CSV ตามเอกสารนี้ และทุกเงื่อนไขปรับปรุงยังต้องมีผลรันใหม่

## TC-001

สมัครบัญชีนักศึกษาผ่านหน้าเว็บและตรวจว่าการส่ง role=admin ไม่ทำให้ได้รับสิทธิ์ผู้ดูแลระบบ

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- เปิดหน้า /register ได้และยังไม่ล็อกอิน ไม่มี cookie uniresearch_access_token
- ไม่มีผู้ใช้ email 674259024@webmail.npru.ac.th และ 674259010@webmail.npru.ac.th; สำหรับการสมัครปกติเพิ่มเติมให้เตรียม 674259006@webmail.npru.ac.th ซึ่งยังไม่มีเช่นกัน

**ข้อมูลทดสอบ:**

- ฟอร์มปกติ: ณัฐพล กลิ่นจุ่น, 674259006@webmail.npru.ac.th; ฟอร์มส่ง role=admin: สมหมาย สุภาวงค์, 674259024@webmail.npru.ac.th; backend: นันธชัย กุลฉวะ, 674259010@webmail.npru.ac.th
- email สำหรับตรวจฟอร์มปกติเพิ่มเติม=674259006@webmail.npru.ac.th; รหัสผ่านและยืนยันรหัสผ่านใช้ค่าจริง TEST_PASSWORD ของสำเนาฐานทดสอบรอบเดียวกัน
- JSON ไป backend: {"email":"674259010@webmail.npru.ac.th","password":"ค่ารหัสผ่านของรอบทดสอบ","role":"admin","first_name":"นันธชัย","last_name":"กุลฉวะ"}; ต้องแทนค่ารหัสผ่านก่อนส่ง

**ขั้นตอน:**

1. เปิด /register กรอกชื่อ “ณัฐพล” นามสกุล “กลิ่นจุ่น” email 674259006@webmail.npru.ac.th และรหัสผ่านของรอบทดสอบในช่องรหัสผ่านและยืนยัน แล้วกด “สร้างบัญชี”
2. ตรวจว่าพาไป /login?registered=1 แสดง “สร้างบัญชีนักศึกษาแล้ว กรุณาเข้าสู่ระบบ” และยังไม่มี cookie session
3. เปิด /register ใหม่ กรอกชื่อ “สมหมาย” นามสกุล “สุภาวงค์” email 674259024@webmail.npru.ac.th และแก้ body ของคำขอ /api/auth/register ที่ออกจากฟอร์มให้มี role="admin" ตามวิธีใน RegistrationPage.register_with_admin_role
4. ส่ง POST /auth/register โดยตรงด้วย email 674259010@webmail.npru.ac.th, first_name="นันธชัย", last_name="กุลฉวะ", รหัสผ่านรอบทดสอบ และ role="admin"
5. ตรวจ users ของทั้งสาม email ต้องมี role="student" และ response ไม่เปิดเผย password/hashed_password; ไม่ถือว่าการสมัครปกติด้วย 674259006@webmail.npru.ac.th เคยถูกรันในผลย้อนหลังหากไม่มีหลักฐาน

**ผลที่คาดหวังและจุดตรวจ:**

- บัญชี 674259006@webmail.npru.ac.th, 674259024@webmail.npru.ac.th และ 674259010@webmail.npru.ac.th ที่สร้างในกรณีนี้มี role=student แม้สองคำขอหลังส่ง role=admin
- backend สมัครสำเร็จตอบ 200; เว็บพาไป /login?registered=1 และแสดงข้อความสร้างบัญชีนักศึกษา โดยไม่สร้าง session อัตโนมัติ
- response ไม่คืน password หรือ hashed_password; ผลของ 674259006@webmail.npru.ac.th เป็นการตรวจเพิ่ม มิใช่ผลรันย้อนหลัง

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-002

ปฏิเสธการสมัครสมาชิกด้วยอีเมล 674259009@webmail.npru.ac.th ที่มีอยู่แล้วโดยไม่สร้างผู้ใช้ซ้ำ

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- ฐานทดสอบมีผู้ใช้เลข 2 email 674259009@webmail.npru.ac.th, role=student, student_id=674259009, is_active=1
- reset ฐานทดสอบก่อนเริ่ม; จำนวนผู้ใช้เริ่มต้น 8 ราย
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- email=674259009@webmail.npru.ac.th; password ใช้รหัสผ่านจริงของรอบ
- POST /auth/register แบบ JSON; ไม่ส่ง email ผิดรูปแบบหรือเปลี่ยนเป็น email ใหม่

**ขั้นตอน:**

1. อ่าน users โดย email 674259009@webmail.npru.ac.th บันทึกว่ามีหนึ่งแถวและจำนวนผู้ใช้ทั้งหมดเท่ากับ 8 ก่อนเริ่ม
2. ส่ง POST /auth/register ด้วย email 674259009@webmail.npru.ac.th และรหัสผ่านรอบทดสอบ
3. ตรวจ HTTP 400 และ detail="Email already registered"
4. นับ users ซ้ำ ต้องมี 8 รายและ 674259009@webmail.npru.ac.th เพียงหนึ่งแถว ข้อมูลผู้ใช้เลข 2 ต้องไม่เปลี่ยน

**ผลที่คาดหวังและจุดตรวจ:**

- HTTP 400,detail="Email already registered"
- จำนวน users ยัง 8 และ email 674259009@webmail.npru.ac.th มีเพียงหนึ่งแถว; id=2/role/student_id เดิมไม่เปลี่ยน

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-003

เข้าสู่ระบบด้วยบัญชีนักศึกษา 674259009@webmail.npru.ac.th และตรวจข้อมูลผู้ใช้กับ session หลังเข้าสู่ระบบ

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- มีบัญชี 674259009@webmail.npru.ac.th ผู้ใช้เลข 2 รหัสนักศึกษา 674259009 สถานะ active
- เปิด browser ใหม่และใช้รหัสผ่านจริงจาก TEST_PASSWORD หรือค่าที่ runner สุ่มในรอบนั้น ไม่ใช้ development login
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- หน้าเว็บ /login: email=674259009@webmail.npru.ac.th; password=ค่ารอบทดสอบ
- backend POST /auth/login: username=674259009@webmail.npru.ac.th และ password เดียวกัน ในรูป form-urlencoded

**ขั้นตอน:**

1. เปิด /login กรอก 674259009@webmail.npru.ac.th และรหัสผ่านที่ใช้สร้างผู้ใช้ในรอบนี้ แล้วกดปุ่มเข้าสู่ระบบ
2. ตรวจ URL หลังส่งต้องเป็น /account/saved และมี cookie uniresearch_access_token
3. ส่ง POST /auth/login แบบ application/x-www-form-urlencoded โดยใช้ username=674259009@webmail.npru.ac.th และรหัสผ่านเดิม
4. ตรวจ HTTP 200, token_type="bearer" และมี access_token แล้วใช้ token นี้เรียก GET /auth/me
5. ตรวจ id=2,email=674259009@webmail.npru.ac.th,role=student,student_id=674259009 โดยไม่คัดลอก token ลงรายงาน

**ผลที่คาดหวังและจุดตรวจ:**

- backend login200,token_type=bearer และมี access_token
- GET /auth/me200 มี id=2,email=674259009@webmail.npru.ac.th,role=student,student_id=674259009
- หน้าเว็บไป /account/saved และมี HttpOnlysession cookie; การเข้าสู่ระบบของ admin/advisor ต้องแยก subcase หากเพิ่ม

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-004

ปฏิเสธการเข้าสู่ระบบของ 674259009@webmail.npru.ac.th เมื่อกรอกรหัสผ่านผิดและไม่สร้าง session

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- มีบัญชี active 674259009@webmail.npru.ac.th และ browser ไม่มี cookie session
- ตรวจว่าค่ารหัสผ่านผิดในกรณีนี้ต่างจากรหัสจริงของรอบ
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- email=674259009@webmail.npru.ac.th; รหัสผ่านผิดบน UI=DeliberatelyIncorrectPassword; รหัสผ่านผิดผ่าน backend=wrong
- หาก TEST_PASSWORD ของรอบตรงกับค่ารหัสผิดข้างต้น ให้เปลี่ยนค่ารหัสผิดและบันทึกชื่อชุดข้อมูลที่ใช้โดยไม่เผยรหัสจริง

**ขั้นตอน:**

1. เปิด /login กรอก email 674259009@webmail.npru.ac.th และรหัสผิด DeliberatelyIncorrectPassword แล้วกดเข้าสู่ระบบ
2. ตรวจข้อความอีเมลหรือรหัสผ่านไม่ถูกต้อง และยังอยู่หน้า /login
3. ตรวจว่าไม่มี cookie uniresearch_access_token ถูกสร้างขึ้น
4. ส่ง POST /auth/login โดยตรงด้วย username=674259009@webmail.npru.ac.th และ password=wrong ตรวจ HTTP 400 และไม่มี access_token

**ผลที่คาดหวังและจุดตรวจ:**

- UI แสดง “อีเมลหรือรหัสผ่านไม่ถูกต้อง” และยังอยู่ /login
- backend ได้ HTTP 400 ไม่มี access_token; ไม่มี session cookie ใหม่

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-005

แก้ชื่อและภาควิชาของ 674259009@webmail.npru.ac.th พร้อมเปลี่ยนรหัสผ่านและตรวจการเข้าสู่ระบบด้วยรหัสใหม่

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- ผู้ใช้เลข 2 email 674259009@webmail.npru.ac.th active; ภาควิชาเดิม=วิศวกรรมซอฟต์แวร์
- เพิ่มตัวเลือกภาควิชา Test Department ในฐานทดสอบก่อนเปิดฟอร์ม; เก็บวิธี reset บัญชีหลังจบ
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

- ค่า first_name=Changed และภาควิชา Test Department เป็นค่าทดสอบการแก้ไขเฉพาะสำเนา; ชื่อต้นทางคือ นรงศ์ศักดิ์ ภูมิประเสริฐ ภาควิชา วิศวกรรมซอฟต์แวร์

**ข้อมูลทดสอบ:**

- first_name ใหม่=Changed; department ใหม่=Test Department
- รหัสผ่านใหม่และยืนยันรหัสผ่านใหม่=NewTestPassword123 เป็นค่าทดสอบที่ปรากฏใน test_tc_005; ไม่ใช่รหัสบัญชีใช้งานจริง

**ขั้นตอน:**

1. ล็อกอินด้วย 674259009@webmail.npru.ac.th และรหัสผ่านตั้งต้นของรอบ แล้วเปิด /student/profile
2. กรอกช่อง “ชื่อจริง” เป็น Changed เลือกภาควิชา Test Department และกรอกรหัสใหม่กับยืนยันเป็น NewTestPassword123
3. กดบันทึก รอ users.id=2 เปลี่ยน first_name เป็น Changed แล้ว reload หน้า
4. เรียก GET /auth/me ตรวจ first_name="Changed" และ department="Test Department"; ตรวจว่าฐานข้อมูลเก็บ hash ไม่ใช่ข้อความรหัสผ่าน
5. logout แล้วลองรหัสตั้งต้นเดิมต้องเข้าไม่ได้ จากนั้นใช้ 674259009@webmail.npru.ac.th กับ NewTestPassword123 ต้องเข้าได้; การลองรหัสเดิมเป็นเงื่อนไขเพิ่มที่ต้องมีหลักฐานรอบใหม่

**ผลที่คาดหวังและจุดตรวจ:**

- GET /auth/me และหน้า profile หลัง reload มี first_name=Changed,department=Test Department
- รหัสใหม่ NewTestPassword123 ใช้ได้และเก็บเป็น hash ไม่ใช่ plaintext
- การลองรหัสตั้งต้นเดิมหลังเปลี่ยนต้อง 400 เป็นเงื่อนไขเพิ่ม; ไม่คาดว่า token เก่าถูก revoke อัตโนมัติ

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-006

ปฏิเสธ token ปลอม บัญชี 674259013@webmail.npru.ac.th ที่ปิดใช้งาน และการแก้อีเมลให้ซ้ำ 674259009@webmail.npru.ac.th

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- มี 674259009@webmail.npru.ac.th ผู้ใช้เลข 2 และ 674259003@webmail.npru.ac.th ผู้ใช้เลข 3 ซึ่ง active
- นำข้อมูลวัชรากร เอี่ยมสำอางค์ 674259013@webmail.npru.ac.th มาสร้างเป็นผู้ใช้เลข 8 ในฐานทดสอบแล้วตั้ง is_active=0; CSV ต้นฉบับเป็น true และมี JWT ที่ลงนามถูกต้องสำหรับบัญชีนี้
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; กิติกร เทศธรรม — 674259003@webmail.npru.ac.th; วัชรากร เอี่ยมสำอางค์ — 674259013@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- Authorization กรณีปลอม=Bearer fake-token
- บัญชี inactive=674259013@webmail.npru.ac.th; บัญชีที่แก้อีเมล=674259003@webmail.npru.ac.th; JSON แก้โปรไฟล์={"email":"674259009@webmail.npru.ac.th"}

**ขั้นตอน:**

1. GET /auth/me โดยใส่ Authorization: Bearer fake-token ตรวจ HTTP 401
2. GET /auth/me ด้วย JWT ของ 674259013@webmail.npru.ac.th ตรวจ HTTP 400 และ detail="Inactive user"
3. ล็อกอิน 674259003@webmail.npru.ac.th แล้วส่ง PUT /auth/me ด้วย JSON {"email":"674259009@webmail.npru.ac.th"}
4. ตรวจ HTTP 400 และอ่าน users.id=3 ซ้ำ email ต้องยังเป็น 674259003@webmail.npru.ac.th; ผู้ใช้เลข 2 ยังคง email เดิม

**ผลที่คาดหวังและจุดตรวจ:**

- token ปลอม ได้ 401; token ของ 674259013@webmail.npru.ac.th inactive ได้ 400/Inactive user
- 674259003@webmail.npru.ac.th เปลี่ยน email เป็น 674259009@webmail.npru.ac.th ไม่ได้:400; users.id=3 ยัง email=674259003@webmail.npru.ac.th

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-007

ออกจากระบบของ 674259009@webmail.npru.ac.th แล้วตรวจว่าคุกกี้ถูกลบและเข้าหน้ารายการบันทึกไม่ได้

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- บัญชี 674259009@webmail.npru.ac.th active; frontend/backend พร้อม
- เริ่ม browser ใหม่เพื่อแยก session จากกรณีอื่น
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- บัญชี=674259009@webmail.npru.ac.th; protected route=/account/saved
- cookie ที่ตรวจ=uniresearch_access_token; logout endpoint ของเว็บ=POST /api/auth/logout

**ขั้นตอน:**

1. ล็อกอิน 674259009@webmail.npru.ac.th ผ่าน /login แล้วเปิด /account/saved ให้สำเร็จ
2. ตรวจ cookie uniresearch_access_token มี HttpOnly และ SameSite=Lax โดยไม่บันทึกค่า token
3. กดออกจากระบบผ่านหน้าเว็บ ตรวจคำขอ POST /api/auth/logout และผลตอบ 200
4. ตรวจ cookie ถูกลบ แล้วเปิด /account/saved ใหม่ต้องถูกพาไป /login โดยอาจมี next query
5. แยกการลบ cookie ออกจากการ revoke JWT: ห้ามสรุปว่า JWT เดิมถูกยกเลิกใน backend เพราะ logout นี้ลบ session ฝั่งเว็บ

**ผลที่คาดหวังและจุดตรวจ:**

- มี cookie uniresearch_access_token หลัง login โดย HttpOnly/SameSite=Lax/path=/
- logout200 และ cookie ถูกลบ; protectedroute/account/saved พาไป /login
- ไม่มีข้อยืนยันว่า JWT ที่เคยออกถูก revoke ใน backend

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-008

ผู้ดูแลระบบ admin@uniresearch.ac.th สร้าง อ่าน แก้ไข และลบบัญชี 674259002@webmail.npru.ac.th ผ่านเว็บและ API

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- มีผู้ดูแลระบบ admin@uniresearch.ac.th ผู้ใช้เลข 1, role=admin, active
- ไม่มี 674259002@webmail.npru.ac.th และ tko@webmail.npru.ac.th; บัญชีที่จะลบไม่มี relation กับงาน

- ชื่อผู้ใช้ใหม่ใน CSV คือ ชญานนท์ อารีย์ role=student; ค่า Updated/role=advisor หลัง PUT เป็นการเปลี่ยนเฉพาะสำเนาเพื่อทดสอบ ไม่ใช่ role ของบุคคลนี้ใน CSV

**ข้อมูลทดสอบ:**

- ฟอร์มสร้างผู้ใช้: email=674259002@webmail.npru.ac.th, first_name=ชญานนท์, last_name=อารีย์, role=student, password=ค่ารอบทดสอบ
- ข้อมูลแก้ไขผ่าน API={"first_name":"Updated","role":"advisor"}
- positive control POST /users/: email=tko@webmail.npru.ac.th, role=advisor, password=ค่ารอบทดสอบ

**ขั้นตอน:**

1. ล็อกอิน admin@uniresearch.ac.th เปิด /admin/users กด “เพิ่มผู้ใช้ใหม่”
2. กรอก 674259002@webmail.npru.ac.th ชื่อ ชญานนท์ นามสกุล อารีย์ รหัสผ่านรอบทดสอบ และเลือก student แล้วบันทึก; อ่าน id ที่ระบบสร้างจาก response/DB ไม่กำหนดเลขล่วงหน้า
3. ใช้สิทธิ์ admin@uniresearch.ac.th GET /users/เลขผู้ใช้ที่สร้าง ตรวจข้อมูล 674259002@webmail.npru.ac.th
4. PUT ผู้ใช้รายเดิมด้วย {"first_name":"Updated","role":"advisor"}; ใช้ API เพราะ UI ปัจจุบันเสนอ reviewer แทน advisor แล้วตรวจ persistence
5. DELETE ผู้ใช้ที่สร้าง ตรวจ 204 body ว่าง และ GET ID เดิมต้อง 404
6. POST /users/ โดยตรงสร้าง tko@webmail.npru.ac.th role=advisor ตรวจ 201 แยกจาก proxy ซึ่งอาจเปลี่ยน status

**ผลที่คาดหวังและจุดตรวจ:**

- 674259002@webmail.npru.ac.th ถูกสร้างผ่าน UI ด้วย role=student และอ่าน id จริงได้; PUT โดย admin เปลี่ยน first_name=Updated/role=advisor คงอยู่ใน DB
- backendPOSTpositive control: tko@webmail.npru.ac.th ได้ 201; GET /PUT ได้ 200
- DELETE ผู้ใช้ 674259002@webmail.npru.ac.th ได้ 204 ไม่มี body แล้ว GETid เดิม 404; response ไม่เผย hashed_password

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-009

ปฏิเสธการอ่าน สร้าง แก้ไข และลบผู้ใช้ผ่าน API เมื่อใช้สิทธิ์นักศึกษา 674259009@webmail.npru.ac.th

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- 674259009@webmail.npru.ac.th ผู้ใช้เลข 2 role=student active; 674259003@webmail.npru.ac.th ผู้ใช้เลข 3 เป็นเป้าหมาย
- เก็บ snapshot id,email,role,first_name ของผู้ใช้ทั้ง 8 ราย
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; กิติกร เทศธรรม — 674259003@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- GET /POST /users/; GET /PUT /DELETE /users/3
- body POST={"email":"674259011@webmail.npru.ac.th","password":"ค่ารอบทดสอบ"}; body PUT={"first_name":"Denied"}

**ขั้นตอน:**

1. ล็อกอิน 674259009@webmail.npru.ac.th เพื่อรับ token นักศึกษา
2. ส่ง GET /users/ และ POST /users/ โดยใช้ body สร้าง 674259011@webmail.npru.ac.th
3. ส่ง GET /users/3, PUT /users/3 ด้วย first_name="Denied" และ DELETE /users/3
4. ตรวจทั้งห้าคำขอได้ 403 แล้วเปรียบเทียบ snapshot ผู้ใช้ทุกแถว ต้องไม่เพิ่ม 674259011@webmail.npru.ac.th และ 674259003@webmail.npru.ac.th ไม่เปลี่ยน

**ผลที่คาดหวังและจุดตรวจ:**

- คำขอ GET /POST collection และ GET /PUT /DELETE /users/3 ทั้งห้าได้ 403
- ผู้ใช้ทุกแถวเหมือน snapshot ก่อนเริ่ม ไม่มี 674259011@webmail.npru.ac.th และ 674259003@webmail.npru.ac.th ไม่ถูกเปลี่ยนหรือลบ

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-010

ผู้ดูแลระบบ admin@uniresearch.ac.th เพิ่มหมวดหมู่ Selenium C2 และผู้ไม่เข้าสู่ระบบอ่านหมวดหมู่นี้ได้

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- มีหมวดหมู่เลข 1 ชื่อ วิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์ และเลข 2 ชื่อ วิศวกรรมศาสตร์และนาโนเทคโนโลยี
- ยังไม่มีหมวดหมู่ชื่อ Selenium C2 ซึ่งเป็นคนละชื่อกับ วิศวกรรมศาสตร์และนาโนเทคโนโลยี

**ข้อมูลทดสอบ:**

- ผู้สร้าง=admin@uniresearch.ac.th; category_name=Selenium C2; description=Created through Selenium
- หน้าจัดการ=/admin/categories; API สาธารณะ=GET /categories/

**ขั้นตอน:**

1. เปิด /research แบบไม่ล็อกอิน ตรวจว่ามีตัวเลือก วิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์ และ วิศวกรรมศาสตร์และนาโนเทคโนโลยี
2. ล็อกอิน admin@uniresearch.ac.th เปิด /admin/categories
3. กรอกชื่อ Selenium C2 และคำอธิบาย Created through Selenium แล้วกด “เพิ่มหมวดหมู่”
4. reload ตรวจหมวดหมู่ที่สร้างมีหนึ่งแถวและ id เป็นบวก; GET /categories/ แบบไม่มี token ต้องคืนชื่อและคำอธิบายนี้
5. logout และเปิด /research ตรวจพบตัวเลือก Selenium C2

**ผลที่คาดหวังและจุดตรวจ:**

- หมวดหมู่ชื่อ Selenium C2/description=Created through Selenium ถูกสร้างหนึ่งแถว มี id จริงเป็นบวก
- backendPOSTcategories200 และ GET แบบ anonymous เห็นหมวดหมู่ใหม่; UI/research หลัง logout เลือกหมวดหมู่นี้ได้

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-011

ปฏิเสธการสร้างหมวดหมู่ Denied C3 เมื่อผู้ส่งคำขอเป็นนักศึกษา 674259009@webmail.npru.ac.th

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- 674259009@webmail.npru.ac.th role=student active; categories มี วิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์ และ วิศวกรรมศาสตร์และนาโนเทคโนโลยี
- ยังไม่มีหมวดหมู่ Denied C3 และไม่มีคำขออื่นแก้รายการระหว่างวัด
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- POST /categories/; JSON={"category_name":"Denied C3"}
- ใช้ bearer token ของ 674259009@webmail.npru.ac.th

**ขั้นตอน:**

1. GET /categories/ เก็บ id/name/description ก่อนเริ่ม
2. POST /categories/ ด้วย token นักศึกษาและ category_name="Denied C3"
3. ตรวจ 403 แล้ว GET /categories/ และนับแถว DB ต้องตรงก่อนทดสอบและไม่มี Denied C3

**ผลที่คาดหวังและจุดตรวจ:**

- POST /categories/โดย 674259009@webmail.npru.ac.th ได้ 403
- รายการ categories/จำนวนแถวตรงก่อนเริ่มและไม่มี Denied C3

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-012

ผู้ดูแลระบบแทนรายการภาควิชาและประเภทงานด้วย New Department กับ New Type พร้อมตัดช่องว่าง

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- admin@uniresearch.ac.th role=admin active; options เดิมคือ วิศวกรรมซอฟต์แวร์ และ วิทยานิพนธ์
- ใช้ฐานทดสอบที่ reset ได้เพราะคำขอแทนรายการเดิมทั้งหมด

**ข้อมูลทดสอบ:**

- POST /options/; JSON={"departments":[" New Department "," "],"work_types":[" New Type ",""]}
- ผลที่ต้องเก็บจริง: departments=["New Department"], work_types=["New Type"]

**ขั้นตอน:**

1. GET /options/ บันทึกรายการเดิม และล็อกอิน admin@uniresearch.ac.th
2. POST /options/ ด้วย JSON ที่มีช่องว่างหัวท้ายและรายการว่างตามข้อมูลทดสอบ
3. ตรวจ 200 แล้ว GET /options/ แบบไม่มี token
4. query departments/work_types ต้องเหลือ New Department และ New Type อย่างละหนึ่งชื่อ ไม่เก็บรายการว่างหรือค่าเก่า
5. reset ตัวเลือกหลังจบเพื่อไม่กระทบฟอร์มของกรณีอื่น

**ผลที่คาดหวังและจุดตรวจ:**

- POST /options/โดย admin@uniresearch.ac.th ได้ 200
- GET /DB เหลือ departments=["New Department"],work_types=["New Type"]; ค่าเก่าถูกแทนและรายการว่างไม่ถูกเก็บ
- ตรวจ trim หัวท้าย แต่ไม่อ้างว่าระบบ deduplicate ค่าซ้ำเพราะโค้ดไม่ได้ทำ

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-013

นักศึกษา 674259009@webmail.npru.ac.th บันทึกตัวเลือกส่วนกลางผ่านหน้าเว็บและ API ไม่ได้

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- 674259009@webmail.npru.ac.th active; ภาควิชาเริ่มต้น=วิศวกรรมซอฟต์แวร์; ประเภทงานเริ่มต้น=วิทยานิพนธ์
- เก็บ GET /options/ ก่อนเริ่มและไม่มีการแก้รายการพร้อมกัน
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- หน้าที่ลองบันทึก=/admin/options; ค่าโจมตีผ่าน API={"departments":["Denied"],"work_types":["Denied"]}
- ค่าที่เพิ่มผ่าน UI=Denied Selenium Department; ค่า API=Denied; ทั้งสองต้องไม่อยู่ใน GET หลังบันทึกไม่สำเร็จ

**ขั้นตอน:**

1. ล็อกอิน 674259009@webmail.npru.ac.th เปิด /admin/options ตามวิธีที่หน้าเว็บรองรับ
2. กรอก Denied Selenium Department ในช่อง “เพิ่มภาควิชาใหม่ เช่น วิศวกรรมคอมพิวเตอร์” กดเพิ่มภาควิชา แล้วกด “บันทึกการตั้งค่าทั้งหมด” ตรวจข้อความปฏิเสธสิทธิ์
3. GET /options/ เทียบก่อนเริ่ม ต้องไม่เปลี่ยน
4. POST /options/ โดยตรงด้วย token ของ 674259009@webmail.npru.ac.th และ JSON {"departments":["Denied"],"work_types":["Denied"]}
5. ตรวจ 403 แล้ว GET /DB ซ้ำ ต้องไม่มี Denied และยังมีตัวเลือกเดิม

**ผลที่คาดหวังและจุดตรวจ:**

- UI แสดง ข้อความปฏิเสธสิทธิ์ เมื่อบันทึก Denied Selenium Department; ไม่แสดงบันทึกสำเร็จ
- POST /options/ด้วย student และ body ค่า Denied/Denied ได้ 403
- GET /DB ยังเป็นวิศวกรรมซอฟต์แวร์/วิทยานิพนธ์ ไม่มีค่า Denied หรือ Denied Selenium Department

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-014

ตรวจสิทธิ์การค้นหางานที่เผยแพร่และรอตรวจแยกตามผู้เยี่ยมชม นักศึกษา ที่ปรึกษา และผู้ดูแลระบบ

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- โหลดผลงานเลข 1–5 ตามตารางข้อมูลร่วม; เลข 1/4/5 approved และเลข 2/3 pending
- 674259009@webmail.npru.ac.th เป็นผู้ส่งเลข 1/2 และผู้เขียนร่วมเลข 4; 674259003@webmail.npru.ac.th เป็นผู้ส่งเลข 3/4/5
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; กิติกร เทศธรรม — 674259003@webmail.npru.ac.th; ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์ — udsanee@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- คำค้นผ่านหน้าเว็บ=Selenium; category_id=1; คำขอ visibility ใช้ GET /research/search ไม่มี q ก่อน
- บัญชีที่ใช้: g1@example.org, 674259009@webmail.npru.ac.th, udsanee@webmail.npru.ac.th และ admin@uniresearch.ac.th; anonymous ไม่ส่ง token
- กรอง category_id=4 ต้องเหลือเลข 4 สำหรับ anonymous; หมวดหมู่ชื่อ เทคโนโลยีการศึกษาและนวัตกรรมการเรียนรู้

**ขั้นตอน:**

1. เปิด /research?q=การ&category_id=1 แบบไม่ล็อกอิน ตรวจพบ “การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์” และไม่พบ “การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย”
2. GET /research/search แบบ anonymous และ g1@example.org ตรวจ ID={1,4,5}
3. GET ด้วย 674259009@webmail.npru.ac.th ตรวจ ID={1,2,4,5}; ด้วย admin@uniresearch.ac.th และ udsanee@webmail.npru.ac.th ตรวจทุก ID={1,2,3,4,5}
4. GET /research/search?category_id=4 แบบ anonymous ต้องคืนเฉพาะเลข 4 และไม่คืนเลข 3 ที่ pending
5. เทียบรายการ UI กับสิทธิ์ API ของ session เดียวกัน โดยไม่เปิดรายละเอียดงานระหว่างวัดผลค้นหา

**ผลที่คาดหวังและจุดตรวจ:**

- anonymous และ g1@example.org เห็น ID 1/4/5 เท่านั้น; 674259009@webmail.npru.ac.th เห็น 1/2/4/5
- admin@uniresearch.ac.th และ udsanee@webmail.npru.ac.th เห็น ID 1–5 ตามสิทธิ์ search ปัจจุบัน
- anonymous กรอง category_id=4 เหลือ ID 4 ไม่ได้เห็น ID 3 ที่ pending; คำค้น/หมวดหมู่ต้องไม่ข้าม visibility

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-015

ค้นคำจากชื่อระบบแนะนำหัวข้อโครงงานวิจัยและบทคัดย่อคลังความรู้ดิจิทัลแบบ OR พร้อมตรวจลำดับและประวัติค้นหา

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- เริ่มจากผลงาน approved เลข 1 และ 4 โดยคงชื่อและบทคัดย่อจาก migration ตั้งงานสำเนาไม่มีไฟล์เลข 5 เป็น pending เฉพาะกรณีนี้
- ยังไม่มี search_logs ของคำทดสอบ; ไม่เปิดหน้า UI ที่ส่งคำค้นเพิ่มระหว่างนับ

**ข้อมูลทดสอบ:**

- ผลงานเลข 1: การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ ตรงคำค้นแรกในชื่อ
- ผลงานเลข 4: การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา ตรงคำค้นที่สองในบทคัดย่อต้นฉบับ
- q=ระบบแนะนำหัวข้อโครงงานวิจัย แลกเปลี่ยนความรู้ระหว่างมหาวิทยาลัย; positive ranking control ใช้ข้อมูล counters เดิมเลข 1=20 views,เลข 4=40 views

**ขั้นตอน:**

1. เตรียมสถานะงานเลข 5 ตามข้อมูลทดสอบ คง metadata งานเลข 1/4 และเก็บจำนวน search_logs
2. GET /research/search?q=ระบบแนะนำหัวข้อโครงงานวิจัย%20แลกเปลี่ยนความรู้ระหว่างมหาวิทยาลัย แบบ anonymous
3. ตรวจว่าผลมีเลข 1 และ 4 แม้แต่ละงานตรงเพียงหนึ่งคำ และเลข 1 อยู่ก่อนเพราะ match ชื่อมีน้ำหนักมากกว่า abstract
4. ตรวจ search_logs เพิ่มหนึ่งแถว keyword ตรง “ระบบแนะนำหัวข้อโครงงานวิจัย แลกเปลี่ยนความรู้ระหว่างมหาวิทยาลัย”
5. ส่ง q ว่างและช่องว่างล้วนแยกคำขอ ตรวจว่าไม่เพิ่ม search_logs; เป็นการตรวจเพิ่มจาก assertions baseline

**ผลที่คาดหวังและจุดตรวจ:**

- q=ระบบแนะนำหัวข้อโครงงานวิจัย แลกเปลี่ยนความรู้ระหว่างมหาวิทยาลัย คืน ID 1/4 และเลข 1 อยู่ก่อนเลข 4 ตามน้ำหนัก match ชื่อกับ abstract
- ค้นแบบ OR ของแต่ละคำบน title/keywords/abstract ไม่บังคับทุกคำอยู่ในงานเดียวกัน
- search_logs เพิ่มหนึ่งแถว keyword เดิม; q ว่าง/ช่องว่างล้วนไม่เพิ่ม log

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-016

คำแนะนำการค้นหาคืนเฉพาะชื่อและคำสำคัญของงานที่เผยแพร่เมื่อค้น publickeyword หรือ pendingsecret

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- งานเลข 1 และ 4 approved มี keyword publickeyword; งานเลข 2 pending มี keyword pendingsecret
- reset search_logs ก่อนตรวจ fallback แล้วแยกการทดสอบมีประวัติค้นหา

**ข้อมูลทดสอบ:**

- q=publickeyword; q=pendingsecret; q=การ; และ q ว่าง
- งาน pending ที่ห้ามอยู่ใน title suggestions คือ “การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย” เลข 2 และ “การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล” เลข 3

**ขั้นตอน:**

1. เปิดช่องค้นหาและพิมพ์ publickeyword ตรวจ dropdown และ GET /research/search/suggestions?q=publickeyword
2. ค้น pendingsecret ตรวจว่าไม่แนะนำ keyword จากงานเลข 2 ใน branch q ไม่ว่าง
3. ค้น Selenium ตรวจ titles ของงาน approved เท่านั้น ไม่รวมเลข 2/3 และจำนวนไม่เกิน 5
4. GET suggestions โดย q ว่างเมื่อ search_logs ว่าง ตรวจ fallback จาก keywords ของ approved
5. เพิ่ม search_logs ด้วยคำค้นจริง “Selenium” แล้วเรียก q ว่างซ้ำ แยกผล keyword ที่มาจากประวัติค้นหาออกจาก metadata ของงาน pending

**ผลที่คาดหวังและจุดตรวจ:**

- q ไม่ว่าง:keyword publickeyword และ titles มาจาก approved เท่านั้น; pendingsecret/งานเลข 2/3 ต้องไม่ปรากฏ
- titles/keywords ไม่เกินอย่างละ 5
- q ว่าง:titles=[]; keywords มาจาก 30 search_logs ล่าสุดก่อน fallback ไป approved เมื่อไม่มี log จึงไม่อ้างว่าทุก keyword ในทุก branch ดึงจาก approved

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-017

หน้าแรกจัดงานล่าสุดและยอดนิยมถูกลำดับพร้อมสถิติรวมตรงกับข้อมูลผู้ใช้และผลงานทั้งหมด

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- โหลดข้อมูลเริ่มต้น 8 ผู้ใช้และ 5 ผลงาน; ไม่เปิดรายละเอียดก่อนวัดเพราะเพิ่ม view_count
- งานเลข 4 approved เผยแพร่ 2026-10-02 มียอดดู 40 ซึ่งใหม่และสูงกว่าเลข 1/5

**ข้อมูลทดสอบ:**

- GET /home/latest?limit=1; GET /home/popular?limit=1; GET /stats/
- ค่าคาดหวังจาก seed: total_users=8,total_research_works=5,total_views=70,total_downloads=0; งานล่าสุด/ยอดนิยมคือเลข 4

**ขั้นตอน:**

1. ตรวจ DB ว่าข้อมูลและ counters ยังตรง seed แล้ว GET /home/latest?limit=1 แบบ anonymous
2. ตรวจผลหนึ่งงานคือ “การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา” สถานะ approved
3. GET /home/popular?limit=1 ต้องได้งานเลข 4 เช่นกัน
4. GET /stats/ และเทียบ 8 ผู้ใช้/5 งาน/70 views/0downloads กับ COUNT/SUM ใน DB
5. หากเพิ่มกรณี pending มียอดสูง ให้ reset และกำหนดเลข 2view_count=100 แล้วตรวจว่าไม่ขึ้น latest/popular แต่ stats ต้องรวมยอดใหม่เป็น 170

**ผลที่คาดหวังและจุดตรวจ:**

- latest?limit=1 และ popular?limit=1 คืนงานเลข 4 approved ตาม published_at/view_count
- จาก seed ก่อนมี interaction stats ได้ 8 ผู้ใช้/5 งาน/70 views/0downloads
- กรณีเพิ่ม pending เลข 2views100 ต้องไม่ทำให้ขึ้น latest/popular; stats รวมทุกสถานะและเป็น 170 views หลัง override

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-018

เปิดรายละเอียดงานเลข 1 แล้วเพิ่มยอดดูและแนะนำงานที่เกี่ยวข้องโดยไม่รวมงานรอตรวจ

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- งานเลข 1 “การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์” approved,view_count=20; เลข 2 pending; เลข 4 approved
- ไม่มี view log ก่อนเริ่ม และแยกคำขอ backend ที่วัด counter ออกจากการเปิด UI

**ข้อมูลทดสอบ:**

- GET /research/1; GET /research/1/recommendations; GET /research/2 แบบ anonymous
- view_count เลข 1 ก่อนวัด=20; งาน related ที่อนุญาตคือ approved เลข 4/5 โดยไม่บังคับลำดับเมื่อคะแนนเท่ากัน

**ขั้นตอน:**

1. อ่าน counter และจำนวน view log เลข 1 จาก DB โดยไม่เรียก detail API
2. GET /research/1 หนึ่งครั้ง ตรวจ title/id/status และ view_count เพิ่ม 20→21 พร้อม view log หนึ่งแถว
3. GET /research/1/recommendations ตรวจ HTTP 200 และผลไม่รวมเลข 1/2/3 คืนเฉพาะ approved ไม่เกิน 5
4. เปิดหน้า /research/1 ตรวจข้อมูลและงานแนะนำบน UI แยกจากการนับ HTTP ครั้งก่อน
5. GET /research/2 แบบ anonymous และบันทึกว่ารายละเอียด pending เข้าถึงได้ตาม implementation เป็น observation รอนโยบาย

**ผลที่คาดหวังและจุดตรวจ:**

- GET backend/detail เลข 1 หนึ่งครั้งเพิ่ม view_count20→21 และ view log หนึ่งแถว; view log ไม่ผูก user_id ในโค้ดปัจจุบัน
- recommendations ได้ 200 ไม่ใช่ 500 คืน approved อื่นไม่เกิน 5 และไม่รวม ID 1/2/3
- การเห็น pending เลข 2 ผ่าน URL ตรงเป็น observation ด้านนโยบาย; แยกจำนวน HTTP จริงจากจำนวนครั้งเปิด UI

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-019

แสดงข้อความไม่พบผลงานเมื่อเปิดรหัส 999999999 และไม่สร้างประวัติการเข้าชม

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- ตรวจ research_works ไม่มี id=999999999; browser เปิดหน้าได้ตามปกติ
- download_view_logs ไม่มีแถวของ research_id=999999999 ก่อนเริ่ม

**ข้อมูลทดสอบ:**

- หน้าเว็บ=/research/999999999; backend GET /research/999999999
- ข้อความบน UI ที่ตรวจ=รหัสงานวิจัยนี้ไม่มีอยู่ในระบบ

**ขั้นตอน:**

1. GET /research/999999999 โดยตรง ตรวจ HTTP 404
2. เปิดหน้าเว็บ /research/999999999 รอข้อความ “รหัสงานวิจัยนี้ไม่มีอยู่ในระบบ”
3. query download_view_logs ของ research_id=999999999 ต้อง 0 แถว และไม่ถือว่า HTTP ของหน้า Next.js ต้องเท่ากับ API

**ผลที่คาดหวังและจุดตรวจ:**

- backendGET/research/999999999 ได้ 404
- UI แสดง “รหัสงานวิจัยนี้ไม่มีอยู่ในระบบ”; HTTP หน้า Next.js ไม่จำเป็นต้องเท่ากับ API
- ไม่มี view log หรือแถวผลงานของ ID 999999999 ถูกสร้าง

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-020

จัดอันดับคำแนะนำส่วนบุคคลจากความนิยมและรายการบันทึกของ 674259009@webmail.npru.ac.th โดยคืนเฉพาะงานที่เผยแพร่

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- โหลดงานเลข 1/4/5 approved และ counters20/40/10 ตามลำดับ; download_count ทุกงาน 0
- 674259009@webmail.npru.ac.th ยังไม่มี favorite หรือ view/download log ก่อนคำขอชุดแรก
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- GET /research/recommendations/personalized; POST /favorites/1 ด้วย 674259009@webmail.npru.ac.th
- ผลไม่มี interaction ควรขึ้นเลข 4 ก่อน; หลังบันทึกเลข 1 ควรขึ้นเลข 1 ก่อนตาม assertion ใน test_tc_020

**ขั้นตอน:**

1. เรียก personalized แบบ anonymous ตรวจเฉพาะ approved และอันดับแรกเลข 4
2. เรียกด้วย 674259009@webmail.npru.ac.th ก่อนมี interaction เพื่อเทียบ popularity fallback
3. POST /favorites/1 ด้วย token ของ 674259009@webmail.npru.ac.th แล้วเรียก personalized ซ้ำ
4. ตรวจเลข 1 ขึ้นก่อนเพราะ profile หมวดหมู่/keyword และทุกผลเป็น approved จำนวนไม่เกิน 5; งานที่เคยบันทึกยังอยู่ในคำแนะนำได้

**ผลที่คาดหวังและจุดตรวจ:**

- ทุกผล approved และไม่เกิน 5; ก่อนมี interaction เลข 4 อันดับแรกจาก popularity
- หลัง favorite เลข 1 โดย 674259009@webmail.npru.ac.th เลข 1 ขึ้นก่อนตาม profile และ popularity จาก fixture
- งานที่เคย favorite อาจอยู่ในผลต่อได้ ไม่ใช่ข้อผิดพลาด

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-021

แสดงรายชื่อนักศึกษาและที่ปรึกษาที่เปิดใช้งานสำหรับเลือกผู้เกี่ยวข้องในการส่งงาน

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- ผู้ใช้ active มี student เลข 2/3/4 และ advisor เลข 5/6; ผู้ใช้เลข 8 674259013@webmail.npru.ac.th inactive
- ล็อกอินด้วย 674259009@webmail.npru.ac.th รหัสนักศึกษา 674259009 เพื่อดู is_current และตัวเลือกในฟอร์ม
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; กิติกร เทศธรรม — 674259003@webmail.npru.ac.th; กัตพัตร์ สมหวัง — 644259003@webmail.npru.ac.th; ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์ — udsanee@webmail.npru.ac.th; ผศ.ดร.วรเชษฐ์ อุทธา — wuttha@webmail.npru.ac.th; วัชรากร เอี่ยมสำอางค์ — 674259013@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- GET /research/participants; หน้า /student/research/new
- authorsAPI: 674259009@webmail.npru.ac.th,674259003@webmail.npru.ac.th,644259003@webmail.npru.ac.th; advisorsAPI: udsanee@webmail.npru.ac.th,wuttha@webmail.npru.ac.th; ต้องไม่รวม 674259013@webmail.npru.ac.th

**ขั้นตอน:**

1. ล็อกอิน 674259009@webmail.npru.ac.th เปิด /student/research/new กรอก title_th=การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน),title_en=Development of an Automatic Research Topic Recommendation System using Artificial Intelligence และเลือกหมวดหมู่เลข 1
2. กด “ดำเนินการต่อ” ไปขั้นผู้เกี่ยวข้อง ตรวจตัวเลือกผู้เขียนเลข 2/3 และที่ปรึกษาเลข 5/6
3. GET /research/participants ด้วย token เดียวกัน ตรวจ authors เป็น role=student, active และ advisors เป็น role=advisor, active
4. ตรวจผู้ใช้เลข 2is_current=true และไม่มีเลข 8; API อาจคืนเลข 4 แต่ UI กรองตาม prefix 67
5. เรียก API ไม่มี token ต้อง 401 และด้วย g1@example.org ต้อง 403

**ผลที่คาดหวังและจุดตรวจ:**

- authorsAPI มี active student เลข 2/3/4; advisors มี active advisor เลข 5/6; ไม่รวม inactive เลข 8
- ผู้ใช้เลข 2is_current=true; UI picker อาจกรองเลข 4 ออกเพราะ prefix 64 ต่างจาก 67
- anonymous ได้ HTTP 401; g1@example.org ได้ HTTP 403; ปฏิเสธแล้วไม่แก้ข้อมูลผู้ใช้

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-022

นักศึกษา 674259009@webmail.npru.ac.th ส่งการพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน) พร้อมผู้เขียน ที่ปรึกษา ภาพปก และ PDF ครบห้าขั้นตอน

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- 674259009@webmail.npru.ac.th ผู้ใช้เลข 2 active; udsanee@webmail.npru.ac.th เลข 5 active; หมวดหมู่เลข 1 ชื่อ วิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์ มีอยู่
- options มีวิศวกรรมซอฟต์แวร์/วิทยานิพนธ์; ยังไม่มีงานใหม่ชื่อ “การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน)”
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์ — udsanee@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- title_th=การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน); title_en=Development of an Automatic Research Topic Recommendation System using Artificial Intelligence; category_id=1
- abstract=บทคัดย่อสำหรับการทดสอบ Selenium กับ backend จริง; department=วิทยาการคอมพิวเตอร์; work_type=วิทยานิพนธ์; academic_year=2568; keywords=selenium,research
- ผู้เขียน=674259009@webmail.npru.ac.th เลข 2,author_ids="[2]"; ที่ปรึกษา=udsanee@webmail.npru.ac.th เลข 5,advisor_ids="[5]"; cover.png=image/png; paper.pdf=application/pdf จาก assets.py

**ขั้นตอน:**

1. ล็อกอิน 674259009@webmail.npru.ac.th เปิด /student/research/new รอ options โหลดครบ
2. ขั้นข้อมูลงาน กรอกชื่อไทย/อังกฤษ เลือก วิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์ และข้อมูลภาควิชา/ประเภท/ปี/keyword ตามค่าข้างต้น แล้วกดดำเนินการต่อ
3. ขั้นผู้เกี่ยวข้อง เลือกผู้เขียน value=2 และที่ปรึกษา value=5 ไม่เพิ่มผู้เขียนร่วมโดยไม่มี subcase แยก
4. กรอกบทคัดย่อที่กำหนดในขั้นเนื้อหา แล้วแนบ cover.png และ paper.pdf ในขั้นไฟล์
5. ตรวจสรุปและกด “ยืนยันและส่งผลงาน” หนึ่งครั้ง รอ “ส่งผลงานเรียบร้อยแล้ว”
6. อ่าน id ที่สร้างจริง ตรวจ submitted_by_id=2,status=pending,author_ids=[2],advisor_ids=[5]และ bytes ไฟล์; เปิดผลงานของฉันต้องแสดง “รอตรวจสอบ”

**ผลที่คาดหวังและจุดตรวจ:**

- POST backend ได้ HTTP 200; งานใหม่ title_th=การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน),title_en=Development of an Automatic Research Topic Recommendation System using Artificial Intelligence,status=pending,submitted_by_id=2
- research_authors มี user_id=2 เพียงคนเดียว role_in_work=primary; research_advisors มี user_id=5 เพียงคนเดียว
- ฟิลด์ร่วม/บทคัดย่อ UI และ bytes ของ cover.png/paper.pdf ตรงที่ส่ง; path อัปโหลดอ่านจากงานใหม่จริง
- หน้าแสดงส่งผลงานเรียบร้อยแล้วและรายการของฉันแสดงรอตรวจสอบ; ไม่สร้าง draft

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-023

ปฏิเสธการส่งผลงานจากผู้ไม่เข้าสู่ระบบและบัญชีผู้เยี่ยมชม g1@example.org

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- โหลด seed5 ผลงาน; ไม่มี session ใน browser ชุดแรก
- g1@example.org ผู้ใช้เลข 7role=guestactive; validmultipart ใช้ข้อมูลตามฟอร์ม API ร่วม

**ข้อมูลทดสอบ:**

- POST /research/ ใช้ title_th=การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบส่งผลงาน),title_en=Development of an Automatic Research Topic Recommendation System using Artificial Intelligence,category_id=1,author_ids="[2]",advisor_ids="[5]"
- กรณีแรกไม่ส่ง Authorization; กรณีที่สองใช้ token ของ g1@example.org

**ขั้นตอน:**

1. เก็บจำนวนผลงานเริ่มต้น 5 แถวและรายการไฟล์
2. เปิด /student/research/new แบบไม่มี session ตรวจ redirect ไป /login
3. POST /research/ด้วย multipart ที่ครบโดยไม่มี token ตรวจ 401
4. POST ข้อมูลเดียวกันโดย token ของ g1@example.org ตรวจ 403
5. ตรวจ research_works ยัง 5 แถวและไม่มี relations/ไฟล์ใหม่

**ผลที่คาดหวังและจุดตรวจ:**

- หน้า new แบบไม่มี session ไป /login; backend ไม่มี token401 และ guest g1@example.org ได้ HTTP 403
- จำนวนงานยัง 5 และไม่มี author/advisor/ไฟล์ใหม่จากคำขอที่ถูกปฏิเสธ

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-024

ปฏิเสธรายการผู้เขียนและที่ปรึกษาที่รูปแบบผิด รหัสไม่มีจริง บทบาทผิด หรือหมวดหมู่ไม่พบ

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- ล็อกอิน 674259009@webmail.npru.ac.th; category_id=1 มีอยู่; ผู้ใช้เลข 2 เป็น student,ผู้ใช้เลข 5 เป็น advisor,ผู้ใช้เลข 8 inactive
- ใช้ multipartAPI ร่วมที่ valid ก่อนเปลี่ยนเพียงหนึ่ง field ต่อคำขอ; 999999 เป็น userID ที่ไม่มีและ category999999 ไม่มี
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- author_ids ทดสอบ: not json,{},[0],[true],[999999],[5] ตาม script; advisor_ids="[2]"ทดสอบ role ผิด
- เงื่อนไขเพิ่ม: author_ids=[-1],["2"],advisor_ids รูปแบบผิด,category_id=999999,author_ids=[8] และ positive control [2,2]

**ขั้นตอน:**

1. snapshot จำนวนงานและ storage แล้วใช้ token ของ 674259009@webmail.npru.ac.th ส่ง POST /research/ทีละค่าใน matrix024-A ถึง F
2. ส่ง author_ids เป็น not json,{},[0],[true]ตรวจ 422; ส่ง[999999]ตรวจ 404
3. ส่ง author_ids=[5]ซึ่งเป็นที่ปรึกษาและ advisor_ids=[2]ซึ่งเป็นนักศึกษา ต้อง 422
4. ตรวจกรณีเพิ่มตาม matrix ด้วยข้อมูลตัวเลขจริง ไม่ส่งข้อความชื่อบัญชีแทน array ของ ID
5. ทุกกรณีปฏิเสธต้องไม่เพิ่มงาน/relations/ไฟล์; positive control [2,2]ต้องสร้าง author เลข 2 แถวเดียวแล้ว reset

**ผลที่คาดหวังและจุดตรวจ:**

- รูปแบบ array ผิด/ID ไม่บวก/boolean/string แทน int และ role ผิดได้ 422
- category999999/ผู้ใช้เลข 999999/inactiveuser8 ได้ 404 ตาม validation แต่ละจุด
- ทุก negative ไม่สร้างงาน/relations/ไฟล์; [2,2]เป็น positive control ที่ถูก deduplicate เป็น author เป็น ผู้ใช้เลข 2 หนึ่งแถว

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-025

ปฏิเสธผู้เขียนร่วมต่างรุ่นระหว่างรหัสนักศึกษา 674259009 และ 644259003 พร้อมตรวจตัวเลือกคนรุ่นเดียวกัน

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- 674259009@webmail.npru.ac.th เลข 2 student_id=674259009;674259003@webmail.npru.ac.th เลข 3 student_id=674259003;644259003@webmail.npru.ac.th เลข 4 student_id=644259003
- ทั้งสาม active; หมวดหมู่ 1 และที่ปรึกษาเลข 5valid
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; กิติกร เทศธรรม — 674259003@webmail.npru.ac.th; กัตพัตร์ สมหวัง — 644259003@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- ผู้เขียนรุ่นเดียวกัน: ผู้ใช้เลข 2/3 prefix=67; ต่างรุ่น: ผู้ใช้เลข 4 prefix=64
- POST /research/ใช้ author_ids="[2,4]",advisor_ids="[5]",category_id=1 และ fields อื่น valid

**ขั้นตอน:**

1. ล็อกอิน 674259009@webmail.npru.ac.th เปิดขั้นผู้เกี่ยวข้องของฟอร์มส่งงาน
2. ตรวจ picker มี value2 และ 3 แต่ไม่มี 4 จากนั้นเลือก value3 ยืนยันว่ารุ่นเดียวกันเลือกได้
3. บันทึกจำนวน research_works ก่อนยิง API แล้ว POST /research/โดย author_ids=[2,4]
4. ตรวจ HTTP 422 และ detail เรื่อง student ID year prefix; จำนวนผลงานไม่เพิ่ม
5. แยก prefix สองตัวแรกของ student_id ออกจาก academic_year=2568 และไม่อ้างว่าบัญชีไม่มี student_id ถูกตรวจรุ่นแล้ว

**ผลที่คาดหวังและจุดตรวจ:**

- UI เสนอผู้ใช้เลข 2/3 ที่ student_id เริ่ม 67 และไม่เสนอผู้ใช้เลข 4 ที่เริ่ม 64
- POST author_ids=[2,4]ได้ 422detail เรื่อง student ID year prefix และไม่สร้างงาน
- prefix คือสองอักขระแรกของ student_id ไม่ใช่ academic_year2569; ผู้ไม่มี student_id ไม่ได้ถูกตรวจรุ่นตามโค้ดปัจจุบัน

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-026

อัปโหลดภาพปกและเอกสาร PDF ที่ขนาดต่ำกว่า เท่ากับ และเกินขีดจำกัดหนึ่งไบต์

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- บัญชี 674259009@webmail.npru.ac.th มีสิทธิ์ส่งงาน; storage แยก; server.py กำหนด cover5MiB และ document25MiB
- สร้างไฟล์จาก PNG/PDF ใน assets.py และตรวจจำนวน bytes ก่อนส่ง ไม่ใช้ไฟล์ชื่อเหมือนกันแต่ขนาดไม่ตรง
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- ภาพ: limit.png MIME image/png ขนาด 5242879/5242880/5242881 bytes
- เอกสาร: limit.pdf MIME application/pdf ขนาด 26214399/26214400/26214401 bytes
- ไฟล์ขนาดเท่าขีดจำกัดต่อข้อมูล PNG/PDF ด้วย space ให้ครบ; ไฟล์เกินเพิ่ม b"x"หนึ่ง byte ตาม test_tc_026; L−1 เป็นเงื่อนไขเพิ่ม

**ขั้นตอน:**

1. ตรวจค่าจริง MAX_COVER_IMAGE_BYTES=5242880 และ MAX_DOCUMENT_BYTES=26214400 ในรอบนี้
2. POST /research/ด้วย token ของ 674259009@webmail.npru.ac.th และ multipartvalid โดยแนบ cover_image=limit.png ทีละขนาดทั้งสาม
3. ตรวจต่ำกว่า/เท่ากับได้ 200 และขนาดไฟล์บน disk ตรง; เกินหนึ่ง byte ได้ 413
4. reset และทำเช่นเดียวกันกับ document=limit.pdf ทั้งสามขนาด
5. หลังทุกคำขอปฏิเสธ เทียบจำนวนงาน/ไฟล์ต้องไม่เพิ่ม; บันทึกผลของ JPEG/WebPpositive control แยกถ้าเพิ่มการตรวจ

**ผลที่คาดหวังและจุดตรวจ:**

- cover5242879/5242880 bytes และ document26214399/26214400 bytes ได้ 200
- cover5242881/document26214401 bytes ได้ 413
- ไฟล์ที่รับมีขนาดตรง input; กรณีปฏิเสธไม่เพิ่มงานหรือทิ้ง partial file; เป็นการตรวจ signature ปัจจุบันไม่ใช่รับรองเนื้อหาทั้งไฟล์

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-027

ปฏิเสธไฟล์เอกสารชนิดหรือเนื้อหาผิดและตรวจไม่ให้ไฟล์ใหม่ค้างหรือไฟล์เดิมสูญหายเมื่อแก้ไขล้มเหลว

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- 674259009@webmail.npru.ac.th มีสิทธิ์ส่ง/แก้งาน; snapshotstorage และ DB ก่อนแต่ละคำขอ
- กรณี update ให้สร้างงานใหม่มี cover/document เฉพาะงาน ไม่แก้ไฟล์ static/fixture.png ที่ seed หลายงานใช้ร่วมกัน
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- cover_image ทุกกรณี=cover.png จาก PNG fixture MIME image/png
- document แยก 4 ชุด: paper.txt+PDF bytes+application/pdf; paper.pdf+PDF bytes+text/plain; paper.pdf+bytes"invalid signature"+application/pdf; paper.pdf+0 bytes+application/pdf
- กรณี update เพิ่ม: cover ใหม่ valid แต่ document ใหม่ลายเซ็นผิด พร้อม snapshotpath/bytes ของไฟล์เก่า

**ขั้นตอน:**

1. ใช้ token ของ 674259009@webmail.npru.ac.th ส่ง POST /research/พร้อม covervalid และ document แต่ละชุดทั้ง 4 ชุดด้วย multipartAPI ร่วม
2. ตรวจทุกชุดได้ 415 และเทียบจำนวนงาน/รายชื่อไฟล์กับ snapshot ต้องไม่เพิ่ม
3. สร้างสำเนางานมีไฟล์ส่วนตัวแล้วส่ง PUT โดย cover ใหม่ valid และ document ใหม่ invalid signature
4. ตรวจ 415 แล้วอ่าน DB/path/bytes ของ cover/document เดิม ต้องบันทึกหาก cover เดิมถูกลบแม้ transaction rollback
5. เก็บผล update เป็นการตรวจเพิ่มที่ต้องรันใหม่ ไม่ใช้ PASScreate เดิมรับรอง file-rollback

**ผลที่คาดหวังและจุดตรวจ:**

- document สี่ชุดผิด extension/MIME/signature/ว่างได้ 415
- create ไม่เหลืองาน/partial cover/document เพิ่ม
- update ที่ล้มเหลวต้องตรวจ path และ bytes ไฟล์เก่าด้วย หาก cover เก่าหายแม้ DB rollback ให้เปิด defect; ยังไม่ใช้ PASScreate เดิมสรุปว่า update ผ่าน

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-028

รายการผลงานของ 674259009@webmail.npru.ac.th แสดงงานที่ส่งเองและเป็นผู้เขียนร่วมโดยไม่แสดงงานของผู้อื่น

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- seed เดิม:ผู้ใช้เลข 2 ส่งเลข 1/2 และร่วมเขียนเลข 4; ต้อง override เลข 2 ก่อนคาดผลเฉพาะ 1/4
- เปลี่ยน research_works.id=2 submitted_by_id=3 และ author หลักของ research_id=2 เป็น user_id=3 ตาม test_tc_028
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- บัญชี=674259009@webmail.npru.ac.th; หน้า /student/research; API GET /research/my
- ID ที่คาดหลัง override={1,4}: “การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์” และ “การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา”; ไม่รวมเลข 2/3/5

**ขั้นตอน:**

1. resetseed แล้วเปลี่ยนผู้ส่งและ author ของงานเลข 2 ไปเป็น 674259003@webmail.npru.ac.th ตาม precondition
2. ล็อกอิน 674259009@webmail.npru.ac.th เปิด /student/research
3. ตรวจพบชื่อเต็มงานเลข 1/4 และไม่พบ “การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล”
4. GET /research/my ด้วย token ของ 674259009@webmail.npru.ac.th ตรวจ ID set={1,4}และ reload หน้า
5. ห้ามใช้ seed เดิมที่เลข 2 ยังเป็นของ 674259009@webmail.npru.ac.th แล้วตัดสินว่าระบบผิดเพราะคืนเลข 2

**ผลที่คาดหวังและจุดตรวจ:**

- หลัง override งานเลข 2 ไปผู้ใช้เลข 3 GET /my ของ 674259009@webmail.npru.ac.th คืน ID set={1,4}
- UI แสดงชื่อเต็มงานเลข 1/4 และไม่แสดงงานที่ไม่เกี่ยวข้องเลข 2/3/5
- ลำดับ created_at ตาม query; เมื่อ timestamp เท่ากันห้ามบังคับลำดับโดยไม่มี ตัวตัดสินลำดับเมื่อค่าเท่ากัน

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-029

เจ้าของแก้ผลงานที่เผยแพร่เป็น การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (ฉบับปรับปรุงสำหรับทดสอบ) แล้วสถานะกลับไปรอตรวจสอบ

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- งานเลข 1 “การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์” approved ส่งโดย 674259009@webmail.npru.ac.th ผู้ใช้เลข 2
- เพิ่ม subcase ผู้เขียนร่วมใช้ 674259009@webmail.npru.ac.th กับงานเลข 4; admin ใช้ admin@uniresearch.ac.th โดย reset ก่อนแต่ละชุด
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- edit_id=1; title_th ใหม่=การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (ฉบับปรับปรุงสำหรับทดสอบ); title_en=Development of an Automatic Research Topic Recommendation System using Artificial Intelligence; category_id=1
- author_ids="[2]",advisor_ids="[5]"; abstract=บทคัดย่อสำหรับการทดสอบ Selenium กับ backend จริง; cover.png/paper.pdfvalid

**ขั้นตอน:**

1. ล็อกอิน 674259009@webmail.npru.ac.th แล้วเปิด /student/research/edit/1
2. กรอกชื่อไทย การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (ฉบับปรับปรุงสำหรับทดสอบ) และข้อมูลอื่นตามฟอร์มส่งงานครบทุกขั้น เลือก author2/advisor5 และแนบไฟล์ valid
3. กดยืนยัน รอ “แก้ไขผลงานเรียบร้อยแล้ว”
4. GET /research/1 ตรวจ title_th="การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (ฉบับปรับปรุงสำหรับทดสอบ)"และ status="pending"; ตรวจ relations/ไฟล์ตรง input
5. reset แล้วทดสอบสิทธิ์ co-author ของงานเลข 4 และ admin แยก เป็นเงื่อนไขเพิ่ม; ไม่คาดว่าประวัติตรวจหรือ published_at ถูกล้างเอง

**ผลที่คาดหวังและจุดตรวจ:**

- PUT เลข 1 สำเร็จ 200 และ title_th=การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (ฉบับปรับปรุงสำหรับทดสอบ),status=pending
- author_ids=[2],advisor_ids=[5]และข้อมูล/ไฟล์ตรงที่ส่ง
- co-author/adminsubcase ตรวจแยกหลัง reset; ไม่คาดว่า published_at หรือ review history ถูกล้าง

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-030

ปฏิเสธการแก้ผลงานเลข 3 ของ 674259003@webmail.npru.ac.th โดยนักศึกษาอื่นและที่ปรึกษาที่ไม่ได้เป็นเจ้าของหรือผู้เขียน

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- งานเลข 3 “การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล” ส่งโดย 674259003@webmail.npru.ac.th และมี author ผู้ใช้เลข 3
- ผู้ใช้เลข 2 674259009@webmail.npru.ac.th ไม่เกี่ยวข้อง; ที่ปรึกษาที่มอบหมายจริงคือ wuttha@webmail.npru.ac.th เลข 6 และไม่ได้เป็น author
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; กิติกร เทศธรรม — 674259003@webmail.npru.ac.th; ผศ.ดร.วรเชษฐ์ อุทธา — wuttha@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- PUT /research/3 ด้วย 674259009@webmail.npru.ac.th; title_th=Denied change; fields อื่นใช้ multipartAPI ร่วม
- subcase เพิ่มใช้ wuttha@webmail.npru.ac.th ที่เป็น advisor ของงานนี้อย่างเดียว เพื่อพิสูจน์ว่า assignment ไม่ให้สิทธิ์แก้

**ขั้นตอน:**

1. เก็บ row งานเลข 3 พร้อม author/advisor/path/bytes ก่อนเริ่ม
2. PUT /research/3 ด้วย token ของ 674259009@webmail.npru.ac.th และ title_th="Denied change"พร้อม fieldsvalid ตรวจ 403
3. เทียบ row/relations/ไฟล์ต้องไม่เปลี่ยน โดยไม่เรียก GET detail ก่อนเก็บ counter หลังทดสอบ
4. reset แล้ว PUT ด้วย wuttha@webmail.npru.ac.th ซึ่งเป็น advisor อย่างเดียว ตรวจ 403 และ snapshot คงเดิม

**ผลที่คาดหวังและจุดตรวจ:**

- 674259009@webmail.npru.ac.th PUT เลข 3 ได้ 403; wuttha@webmail.npru.ac.th ที่เป็น advisor อย่างเดียว PUT เลข 3 ได้ 403 เช่นกัน
- row/relations/path/bytes ของงานเลข 3 คงเดิม; assignment ไม่ให้สิทธิ์แก้โดยตัวมันเอง

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-031

ส่งไฟล์แก้ไข การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ) หลังส่งกลับแก้ไขและเก็บ PDF เดิมเป็นประวัติเวอร์ชันถัดไป

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- งานเลข 2 เดิม “การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย” ของ 674259009@webmail.npru.ac.th มี file_path=static/fixture.pdf
- ก่อนเริ่มเปลี่ยน status=needs_revision และเพิ่ม file_revisions ของ research_id=2,path เดิม,version_no=1,uploaded_by=2,uploaded_at=2026-10-01
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- title_th ใหม่=การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ); title_en=Performance Evaluation of Transformer-based NLP Models for Thai Research Document Classification; author_ids=[2]; advisor_ids=[5]
- paper.pdf ใหม่=PDF fixture ต่อท้าย bytes "\n% Revised Selenium document\n"; cover.png ใหม่จาก PNG fixture

**ขั้นตอน:**

1. ล็อกอิน 674259009@webmail.npru.ac.th เปิดงานเลข 2 ตรวจ UI แสดง “ส่งกลับแก้ไข”
2. เปิด /student/research/edit/2 กรอก การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ) และข้อมูลร่วมครบ แล้วแนบ paper.pdf ที่มีข้อความท้ายต่างจากไฟล์เก่า
3. ยืนยันแก้ไข ตรวจผลงานของฉันแสดง การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ) พร้อม “รอตรวจสอบ”
4. อ่าน research_works.id=2 ตรวจ pending และ file_path ใหม่ต่าง static/fixture.pdf
5. อ่าน file_revisions ล่าสุดต้อง version_no=2,path=static/fixture.pdf,uploaded_by=2; ไฟล์เดิมยังอยู่และ bytes ไฟล์ใหม่ตรง input
6. เงื่อนไขเพิ่มแยก reset:ไม่มี revision เดิมต้องเริ่ม version1; ไม่ส่ง document ใหม่ต้องไม่เพิ่ม revision

**ผลที่คาดหวังและจุดตรวจ:**

- งานเลข 2 pending,title_th=การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย (ฉบับแก้ไขสำหรับทดสอบ),file_path ใหม่ต่าง static/fixture.pdf
- revision ล่าสุดเก็บ path เก่า static/fixture.pdf,version_no=2,uploaded_by2,uploaded_at มีค่า และไฟล์เก่ายังอยู่
- bytes ไฟล์ใหม่=PDF fixture ต่อข้อความ Revised Selenium document ตรง input; UI กลับรอตรวจสอบ
- กรณีเพิ่มไม่มี revision เดิมเริ่ม version1; ไม่ส่ง document ใหม่ไม่เพิ่ม revision

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-032

เจ้าของลบ การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล (สำเนาสำหรับทดสอบการลบ) แล้วลบข้อมูลสัมพันธ์และไฟล์หลักของงานพร้อมตรวจไฟล์เวอร์ชันเก่าตกค้าง

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- ล็อกอิน 674259009@webmail.npru.ac.th และสร้างงานใหม่ชื่อ การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล (สำเนาสำหรับทดสอบการลบ) ผ่านฟอร์มเพื่อให้มีไฟล์เฉพาะงาน
- ต้องไม่ลบงาน seed ที่ใช้ static/fixture.pdf ร่วมกัน; อ่าน id ใหม่จาก response/DB
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- title_th=การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล (สำเนาสำหรับทดสอบการลบ); title_en=Development of an Automatic Research Topic Recommendation System using Artificial Intelligence; author_ids=[2],advisor_ids=[5]; cover.png/paper.pdfvalid
- เพิ่ม favorite ของ ผู้ใช้เลข 2; เงื่อนไขเพิ่มให้เตรียม review/log/revision ของงานนี้จริงและเก็บ path ไฟล์ revision ก่อนลบ

**ขั้นตอน:**

1. ส่งงานชื่อ การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล (สำเนาสำหรับทดสอบการลบ) ผ่าน UI แล้วบันทึก id และ path ไฟล์ที่สร้างจริง
2. POST /favorites/เลขงานใหม่ด้วย 674259009@webmail.npru.ac.th และเตรียม relations เพิ่มเติมตาม precondition
3. เปิดรายละเอียดของงานใหม่ กด “ลบผลงาน (Delete)” และยืนยัน browseralert
4. ตรวจ DELETE 200 และ GETID เดิม 404; query research_authors,research_advisors,review_comments,file_revisions,favorites,download_view_logs ของ ID นี้ต้อง 0 แถว
5. ตรวจ cover/document ปัจจุบันหายจาก disk; ตรวจไฟล์ revision เก่าต่างหากและบันทึก orphan ที่ service ไม่ได้ลบ

**ผลที่คาดหวังและจุดตรวจ:**

- DELETE งานใหม่ได้ 200,message สำเร็จ; GET id เดิม 404
- ตาราง research_authors/research_advisors/review_comments/download_view_logs/favorites/file_revisions ไม่มีแถวของงานที่ลบ
- cover/document ปัจจุบันหาย; ไฟล์ revision เก่าอาจตกค้างเพราะ service ไม่วนลบ ให้บันทึกเป็น observation ไม่อ้างว่าลบทุกเวอร์ชันแล้ว

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-033

ปฏิเสธการลบงานเลข 3 ของ 674259003@webmail.npru.ac.th เมื่อผู้ร้องขอเป็น 674259009@webmail.npru.ac.th ที่ไม่มีส่วนเกี่ยวข้อง

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- research_id=3,title=“การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล”,submitted_by_id=3,author หลัก=ผู้ใช้เลข 3
- 674259009@webmail.npru.ac.th ผู้ใช้เลข 2 ไม่ใช่ผู้ส่งหรือ author ของงานเลข 3
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- DELETE /research/3; bearer token ของ 674259009@webmail.npru.ac.th
- snapshotrow งานเลข 3/relations/ไฟล์ก่อนส่ง; author เดิมหนึ่งแถวของ ผู้ใช้เลข 3

**ขั้นตอน:**

1. อ่าน row งานเลข 3 และ relations/files จาก DB/storage โดยไม่เรียก detail API ก่อน snapshot
2. DELETE /research/3 ด้วย 674259009@webmail.npru.ac.th ตรวจ 403
3. ตรวจ row เดิมไม่เปลี่ยน งานยังอยู่ author เป็น ผู้ใช้เลข 3 หนึ่งแถวและไฟล์เดิมยังอยู่

**ผลที่คาดหวังและจุดตรวจ:**

- DELETE /research/3 โดย 674259009@webmail.npru.ac.th ได้ 403
- row เดิมคงอยู่ author เป็น ผู้ใช้เลข 3 หนึ่งแถว relations และไฟล์ไม่เปลี่ยน

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-034

นักศึกษา 674259009@webmail.npru.ac.th ดาวน์โหลด PDF ของงานเลข 1 พร้อมบันทึกผู้ดาวน์โหลดและเพิ่มตัวนับหนึ่งครั้ง

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- งานเลข 1 approved มี file_path=static/fixture.pdf และไฟล์ PDF จาก assets.py จริง
- 674259009@webmail.npru.ac.th active; download_count เลข 1=0 และยังไม่มี download log
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- หน้า /research/1; ปุ่ม Download PDF; API POST /research/1/download
- file_url=/static/fixture.pdf; ไฟล์ที่ browserhelper เก็บ=downloads/research-1.pdf; expectedbytes=PDF ใน assets.py

**ขั้นตอน:**

1. ล็อกอิน 674259009@webmail.npru.ac.th แล้วเปิด /research/1 เก็บ download_count ก่อนกด
2. กด “Download PDF” หนึ่งครั้ง รอข้อความ “The document download has started.” และไฟล์ดาวน์โหลดมีขนาดมากกว่า 0
3. ตรวจ bytes ของ downloads/research-1.pdf ตรง PDF fixture
4. ตรวจ download_count เพิ่ม 0→1 และ download_view_logs มี user_id=2,action_type="download"หนึ่งรายการ
5. เงื่อนไขเพิ่ม:เปิด /static/fixture.pdf ใน browser ไม่มี session ตรวจเปิดตรงได้และ download_count ยัง 1 โดยบันทึกเป็น observation

**ผลที่คาดหวังและจุดตรวจ:**

- POST download200 คืน file_url=/static/fixture.pdf และ browser ดาวน์โหลด PDF bytes ตรง fixture
- download_count เลข 1 เพิ่ม 0→1 และ log ใหม่ user_id=2/action_type=download หนึ่งแถวต่อ POST หนึ่งครั้ง
- เปิด static โดยไม่มี session ได้ตามปัจจุบันและไม่เพิ่ม download_count เป็น observation ที่ต้องยืนยันนโยบาย

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-035

ปฏิเสธการขอดาวน์โหลดเมื่อไม่มี token งานไม่มีไฟล์ หรือใช้รหัสงานที่ไม่มีในระบบ

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- งานเลข 1 มี static/fixture.pdf; งานเลข 5 “การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์ (สำเนาทดสอบไม่มีไฟล์เอกสาร)” มี file_path=NULL
- download_count ทุกงาน 0 และไม่มี download log; ไม่มี research_id=999999999
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- POST /research/1/download ไม่ส่ง token
- POST /research/5/download และ /research/999999999/download ใช้ token ของ 674259009@webmail.npru.ac.th

**ขั้นตอน:**

1. เก็บผลรวม download_count และจำนวน download log ก่อนเริ่มต้อง 0
2. POST /research/1/download แบบ anonymous ตรวจ 401
3. POST /research/5/download ด้วย 674259009@webmail.npru.ac.th ตรวจ 404
4. เงื่อนไขเพิ่ม:POST /research/999999999/download ด้วย token เดียวกันตรวจ 404
5. ตรวจผลรวม counter/log ยัง 0 และไม่ใช้การ GET staticfile แทน endpoint download

**ผลที่คาดหวังและจุดตรวจ:**

- anonymousPOSTdownload เลข 1 ได้ 401; studentPOST เลข 5 และ ID 999999999 ได้ 404
- download_count รวมยัง 0 และไม่มี download log ใหม่

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-036

คิวรอตรวจแสดงงานตามการมอบหมายของที่ปรึกษาและปฏิเสธนักศึกษาพร้อมตรวจความต่างระหว่าง UI กับ API

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- งานเลข 2 pending และมอบหมายให้ ผู้ใช้เลข 5 udsanee@webmail.npru.ac.th; งานเลข 3 pending และมอบหมายให้ เลข 6 wuttha@webmail.npru.ac.th
- admin@uniresearch.ac.th เป็น admin และ 674259009@webmail.npru.ac.th เป็น student; งานเลข 1/4/5 approved
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์ — udsanee@webmail.npru.ac.th; ผศ.ดร.วรเชษฐ์ อุทธา — wuttha@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- GET /research/pending; admin คาด ID={2,3}; udsanee@webmail.npru.ac.th คาด{2}; wuttha@webmail.npru.ac.th คาด{3}
- หน้า advisor=/advisor/reviews; หน้า admin=/admin/reviews

**ขั้นตอน:**

1. เรียก pending ด้วย admin@uniresearch.ac.th ตรวจ ID 2/3 และด้วย udsanee@webmail.npru.ac.th ตรวจเฉพาะ 2
2. เรียกด้วย wuttha@webmail.npru.ac.th ตรวจเฉพาะ 3; ใช้ 674259009@webmail.npru.ac.th ต้อง 403 และ anonymous ต้อง 401
3. ล็อกอิน udsanee@webmail.npru.ac.th เปิด /advisor/reviews ตรวจเห็นชื่อเต็มงานเลข 2 และบันทึกว่า UI เห็นงานเลข 3 หรือไม่
4. ล็อกอิน admin@uniresearch.ac.th เปิด /admin/reviews ตรวจชื่อเต็มงานเลข 2/3
5. เทียบ ID กับ research_advisors และบันทึก UI queue ที่ใช้ search กว้างกว่า pending API แยกเป็น observation

**ผลที่คาดหวังและจุดตรวจ:**

- pending API ของ admin@uniresearch.ac.th คืน 2/3,ของ udsanee@webmail.npru.ac.th คืน 2,ของ wuttha@webmail.npru.ac.th คืน 3
- 674259009@webmail.npru.ac.th ได้ HTTP 403 และ anonymous ได้ HTTP 401; ไม่คืน approved ใน pending API
- UI advisor ใช้ searchResearch อาจเห็นเลข 3 นอก assignment ให้บันทึกความต่างจาก pending API โดยไม่สรุปว่า UI กรองถูกจาก API อย่างเดียว

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-037

ประวัติการตรวจของที่ปรึกษาและผู้ดูแลระบบเลือกเฉพาะงานที่แต่ละบัญชีเคยตรวจ

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- เพิ่ม review ของ udsanee@webmail.npru.ac.th ผู้ใช้เลข 5 สำหรับงานเลข 1 และ review ของ admin@uniresearch.ac.th ผู้ใช้เลข 1 สำหรับงานเลข 4
- เงื่อนไขเพิ่มให้มีงานเลข 2 ที่ ผู้ใช้เลข 5 เคยตรวจแล้วกลับ pending เพื่อแยกประวัติจาก status ปัจจุบัน
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์ — udsanee@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- GET /research/history ด้วย udsanee@webmail.npru.ac.th,admin@uniresearch.ac.th,674259009@webmail.npru.ac.th
- review ทั้งสองแถว: comment_text=History fixture,score=80,status_result=approved,created_at=2026-10-01 ตาม test_tc_037; เพิ่ม review ของงานเลข 2 ที่กลับ pending เป็น subcase แยก

**ขั้นตอน:**

1. เพิ่ม review สองแถว: research_id=1/reviewer_id=5 และ research_id=4/reviewer_id=1 โดย comment_text=History fixture,status_result=approved,score=80,created_at=2026-10-01; ยังไม่เพิ่ม review ของงานเลข 2 ในชุดแรก
2. ล็อกอิน udsanee@webmail.npru.ac.th เปิด /advisor/history และ GET /research/history ด้วย token เดียวกัน
3. ตรวจงานที่คืนมี reviewer_id=5 อย่างน้อยหนึ่ง review; งานที่มีเฉพาะ reviewer_id=1 ต้องไม่ติดผล
4. GET history ด้วย admin@uniresearch.ac.th ตรวจงานที่ reviewer_id=1; ด้วย 674259009@webmail.npru.ac.th ต้อง 403
5. แยก subcase เพิ่ม: หลังตรวจชุดแรกแล้วเพิ่ม review ของงานเลข 2 โดย reviewer_id=5 และตั้งงานเลข 2 เป็น pending; GET history ของ udsanee@webmail.npru.ac.th ต้องมีเลข 1/2; ไม่บังคับ reviews ที่ซ้อนใน response ทุกแถวเป็นของผู้ร้องขอ

**ผลที่คาดหวังและจุดตรวจ:**

- เมื่อมี History fixture ตาม script GET /history ของ udsanee@webmail.npru.ac.th ได้ ID={1}; ของ admin@uniresearch.ac.th ได้ ID={4}
- 674259009@webmail.npru.ac.th ได้ 403; UI advisor แสดงงานเลข 1 ไม่ใช่เลข 4 ที่ตรวจโดย admin คนเดียว
- งานเลข 2 ที่เพิ่มประวัติแล้วกลับ pending ยังต้องอยู่ history ของผู้ใช้เลข 5; แยก subcase นี้จากผล baseline และ reviews ที่ซ้อนอยู่ใน response อาจมีผู้ตรวจอื่นได้

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-038

ที่ปรึกษา udsanee@webmail.npru.ac.th อนุมัติงานเลข 2 ที่ได้รับมอบหมายด้วยคะแนน 80 และความคิดเห็น Selenium verified review

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- งานเลข 2 “การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย” status=pending และ assigned ให้ ผู้ใช้เลข 5 udsanee@webmail.npru.ac.th
- ยังไม่มี review ของงานนี้; เก็บ status/reviewcount ก่อนเริ่ม
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์ — udsanee@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- หน้าคิว=/advisor/reviews; รายละเอียดตรวจ=/advisor/reviews/2
- status_result=approved; score=80; comment_text=Selenium verified review; reviewer_id ที่คาด=5

**ขั้นตอน:**

1. ล็อกอิน udsanee@webmail.npru.ac.th เปิด /advisor/reviews แล้วคลิกลิงก์ /advisor/reviews/2 จากคิวจริง
2. ตรวจชื่อ “การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย” และเลือก approved ในช่อง status_result
3. กรอก score=80 และ comment_text เป็น Selenium verified review แล้วกด “ยืนยันผลการประเมิน”
4. ตรวจ modal “ยืนยันการอนุมัติผลงาน” แล้วกด “ยืนยัน” หนึ่งครั้ง รอ “บันทึกผลการประเมินผลงานสำเร็จ”
5. เปิด /research/2 ตรวจ “อนุมัติแล้ว” และ DB status=approved,review ใหม่หนึ่งแถว research_id=2,reviewer_id=5,score=80 และ comment ตรง input

**ผลที่คาดหวังและจุดตรวจ:**

- UI แสดงบันทึกผลสำเร็จและงานเลข 2 อนุมัติแล้ว; DB status=approved
- review ใหม่หนึ่งแถว research_id=2/reviewer_id=5,status_result=approved,score=80,comment_text=Selenium verified review
- ไม่ถือว่าผ่านเพียงเพราะเปิด modal ได้ ต้องยืนยันผล persisted หลัง reload

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-039

ปฏิเสธการตรวจงานเมื่อที่ปรึกษาไม่ได้รับมอบหมาย งานไม่รอตรวจ หรือส่งผลตรวจนอกค่าที่รองรับ

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- งานเลข 2 pending และมอบหมายให้ udsanee@webmail.npru.ac.th เลข 5; wuttha@webmail.npru.ac.th เลข 6 ไม่ assigned งานนี้
- งานเลข 1 approved; reset fixture และ snapshot status/reviews/notifications ก่อนแต่ละ subcase
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์ — udsanee@webmail.npru.ac.th; ผศ.ดร.วรเชษฐ์ อุทธา — wuttha@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- body ที่ถูกต้อง={"comment_text":"Denied review","score":80,"status_result":"approved"}
- enum ผิดใช้ status_result="invalid"; ผู้ใช้สิทธิ์ผิด=674259009@webmail.npru.ac.th; ID ไม่มี=999999999

**ขั้นตอน:**

1. POST /research/2/review ด้วย wuttha@webmail.npru.ac.th และ body ที่ถูกต้อง ตรวจ 403
2. reset แล้ว POST /research/1/review ด้วย udsanee@webmail.npru.ac.th ตรวจ 400 เพราะงาน approved
3. reset แล้ว POST /research/2/review ด้วย udsanee@webmail.npru.ac.th แต่ status_result="invalid"ตรวจ 422
4. เพิ่มกรณี 674259009@webmail.npru.ac.th ได้ 403,anonymous ได้ 401 และ udsanee@webmail.npru.ac.th reviewID999999999 ได้ 404
5. ตรวจทุกคำขอปฏิเสธไม่เพิ่ม review/notification และไม่เปลี่ยน status งาน

**ผลที่คาดหวังและจุดตรวจ:**

- wuttha@webmail.npru.ac.th ตรวจเลข 2 ได้ 403; udsanee@webmail.npru.ac.th ตรวจเลข 1 approved ได้ 400; enum invalid ได้ 422
- student ได้ HTTP 403,anonymous ได้ HTTP 401,ID ไม่พบโดย advisor404
- ทุก negative ไม่มี review/notification เพิ่มและ status เดิมคงอยู่

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-040

อนุมัติ ปฏิเสธ และส่งงานกลับแก้ไขพร้อมบันทึกคะแนน ความคิดเห็น และแจ้งผู้ส่งกับผู้เขียนร่วม

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- งานเลข 2 pending ส่งโดย 674259009@webmail.npru.ac.th ผู้ใช้เลข 2 ; เพิ่ม co-author เป็น ผู้ใช้เลข 3 674259003@webmail.npru.ac.th ตาม test_tc_040
- ผู้ตรวจ udsanee@webmail.npru.ac.th ผู้ใช้เลข 5 ได้รับมอบหมาย งานนี้; published_at=NULL ก่อนผลตรวจแต่ละชุด
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; กิติกร เทศธรรม — 674259003@webmail.npru.ac.th; ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์ — udsanee@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- comment_text=Selenium verified review; score=80; status_result=approved สำหรับ baseline
- ผลตรวจเพิ่มที่ต้องแยก reset:rejected และ needs_revision; ผู้รับ notification ของ ผู้ใช้เลข 2 /3 เท่านั้นสำหรับงานนี้

**ขั้นตอน:**

1. เพิ่ม research_authors(research_id=2,user_id=3,role_in_work=co-author)และเก็บ notification เดิม
2. POST /research/2/review ด้วย udsanee@webmail.npru.ac.th,status_result=approved,score=80,comment ตามข้อมูล
3. ตรวจ status=approved,published_at ไม่ NULL,reviewer_id=5 และ notification ใหม่ถึง ผู้ใช้เลข 2/3 โดยไม่ซ้ำ ผู้ใช้เลข 2
4. ล็อกอิน 674259009@webmail.npru.ac.th และ 674259003@webmail.npru.ac.th แยก session เปิด dropdown ตรวจข้อความอ้าง “การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย”
5. เงื่อนไขเพิ่ม:reset งานใหม่ pending/published_atNULL แล้วทำ rejected และ needs_revision ตรวจ typealert/warning และไม่ตั้งวันเผยแพร่; approved ใช้ typesuccess

**ผลที่คาดหวังและจุดตรวจ:**

- approved ตั้ง published_at และ notification type=success; rejected ใช้ alert และ needs_revision ใช้ warning
- review บันทึก reviewer_id=5,score=80,comment ตรง input; ผู้รับผู้ใช้เลข 2/3 ไม่ซ้ำแม้ผู้ใช้เลข 2 เป็นทั้ง submitter และ author
- UI แจ้งเตือนของทั้งสอง email เห็นชื่องานและผลตรวจ; งานใหม่สำหรับ non-approved เริ่ม published_atNULL และไม่ตั้งค่าเผยแพร่
- score ของ review เป็น optionalinteger ซึ่ง schema ไม่จำกัด 0–100; ไม่สร้าง requirement ช่วงคะแนนขึ้นเอง

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-041

ผู้ดูแลระบบเปลี่ยนที่ปรึกษาของงานเลข 2 จาก udsanee@webmail.npru.ac.th เป็น wuttha@webmail.npru.ac.th และนักศึกษาเปลี่ยนไม่ได้

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- งานเลข 2 pending และมอบหมายให้ ผู้ใช้เลข 5 ; ผู้ใช้เลข 6 wuttha@webmail.npru.ac.th เป็น role=advisor, active
- admin@uniresearch.ac.th role=admin, active; 674259009@webmail.npru.ac.th role=student, active
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; ผศ.ดร.วรเชษฐ์ อุทธา — wuttha@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- POST /research/2/assign-advisors ด้วย admin body=[6] เป็น JSON array ตรงๆ
- คำขอนักศึกษาที่ต้องถูกปฏิเสธ body=[5]เพื่อพยายามเปลี่ยนกลับ

**ขั้นตอน:**

1. GET pending ของ udsanee@webmail.npru.ac.th/wuttha@webmail.npru.ac.th และ snapshot assignment ก่อนเปลี่ยน
2. admin@uniresearch.ac.th POST /research/2/assign-advisors ด้วย body[6]ตรวจ 200
3. queryresearch_advisors งานเลข 2 ต้องเหลือ user_id=6; pending ของ udsanee@webmail.npru.ac.th ไม่มีเลข 2 แต่ wuttha@webmail.npru.ac.th มี
4. ใช้ 674259009@webmail.npru.ac.th POSTendpoint เดิมด้วย[5]ตรวจ 403
5. อ่าน relation ซ้ำต้องยังเป็น ผู้ใช้เลข 6 ไม่เปลี่ยนกลับ

**ผลที่คาดหวังและจุดตรวจ:**

- adminPOST[6]ได้ 200 และ research_advisors เลข 2 เหลือผู้ใช้เลข 6
- pending ของ udsanee@webmail.npru.ac.th ไม่มีเลข 2 ของ wuttha@webmail.npru.ac.th มีเลข 2
- studentPOST[5]ได้ 403 และ relation ยังผู้ใช้เลข 6

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-042

บันทึกและยกเลิกงานเลข 1 ในรายการโปรดของ 674259009@webmail.npru.ac.th พร้อมตรวจหน้ารายการบันทึก

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- 674259009@webmail.npru.ac.th ผู้ใช้เลข 2 active; งานเลข 1 approved; ไม่มี favorite ของ ผู้ใช้เลข 2/ผลงานเลข 1
- เงื่อนไขเพิ่มสำหรับ isolation ให้เตรียม favorite ของ 674259003@webmail.npru.ac.th ผู้ใช้เลข 3 /ผลงานเลข 4 ก่อนเริ่ม
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; กิติกร เทศธรรม — 674259003@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- หน้า /research/1; ปุ่ม Save research; POST /favorites/1; GET /favorites/; หน้า /account/saved
- response ยกเลิก detail=Removed from favorites

**ขั้นตอน:**

1. ล็อกอิน 674259009@webmail.npru.ac.th เปิด /research/1 แล้วกด “Save research” หนึ่งครั้ง
2. ตรวจ favorites มี user_id=2,research_id=1 หนึ่งแถวและ GET /favorites/ของบัญชีนี้มีหนึ่งรายการ
3. เปิด /account/saved ตรวจ “การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์”
4. POST /favorites/1 อีกครั้งด้วยบัญชีเดิม ตรวจ 200/detail=Removed from favorites แล้ว GET ต้องเป็น[]
5. reload หน้ารายการบันทึกต้องไม่แสดงชื่องานเลข 1; ตรวจ favorite ของ ผู้ใช้เลข 3/ผลงานเลข 4 คงเดิมถ้าเพิ่ม fixture สำหรับแยกข้อมูลผู้ใช้

**ผลที่คาดหวังและจุดตรวจ:**

- ครั้งแรกสร้าง favoriteuser2/ผลงานเลข 1 และ GET /saved แสดง การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์
- POST ครั้งที่สอง 200/detail=Removed from favorites; GET เป็น[]และ UI หลัง reload ไม่แสดงงานเดิม
- favoriteuser3/ผลงานเลข 4 ไม่เปลี่ยนในกรณีเพิ่ม isolation; toggle ไม่ใช่ idempotent จึงห้าม retry โดยไม่ตั้งใจ

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-043

อ่านแจ้งเตือนและทำเครื่องหมายอ่านทีละรายการหรือทั้งหมดเฉพาะของ 674259009@webmail.npru.ac.th โดยไม่แก้ของ 674259003@webmail.npru.ac.th

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- notification เลข 1 ชื่อ N1 Selenium เป็นของ ผู้ใช้เลข 2 674259009@webmail.npru.ac.th; เลข 2 ชื่อ N2 Selenium เป็นของ ผู้ใช้เลข 3 674259003@webmail.npru.ac.th; is_read=0 ทั้งคู่
- เงื่อนไขเพิ่มสร้าง notification ชื่อ Read-all additional notification ของ ผู้ใช้เลข 2,is_read=0 โดยรับ id ที่สร้างจริง เพื่อให้ read-all ตรวจได้มากกว่าหนึ่งรายการ
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; กิติกร เทศธรรม — 674259003@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- GET /notifications/; POST /notifications/1/read; POST /notifications/2/read; POST /notifications/read-all
- proxy อ่านทั้งหมด=POST /api/notifications body={"all":true}; ข้อความ seed N1 private notification/N2 private notification

**ขั้นตอน:**

1. ล็อกอิน 674259009@webmail.npru.ac.th เปิด dropdown การแจ้งเตือนและ GET /notifications/ตรวจมี N1 Selenium กับรายการเพิ่มของตน แต่ไม่มี N2 Selenium
2. POST /notifications/2/read ด้วย 674259009@webmail.npru.ac.th ตรวจ 404 และ notification เลข 2 ยัง is_read=0
3. กดอ่าน notification เลข 1 ผ่าน UI ตรวจปุ่มอ่านหาย/สถานะอ่านแล้วและ DB เลข 1 is_read=1; รายการเพิ่มและเลข 2 ยังไม่อ่าน
4. reset สถานะของรายการทดสอบให้ unread แล้วกดอ่านทั้งหมดผ่าน UI ตรวจทุก notification ของ ผู้ใช้เลข 2 อ่านแล้วแต่ ผู้ใช้เลข 3 ไม่เปลี่ยน
5. แยกตรวจ backend/read-all และ proxy/api/notifications{"all":true}; หากยังไม่เพิ่มรายการที่สามให้ระบุว่าเป็น coverage เดิมที่มีรายการของตนเพียงหนึ่งรายการ

**ผลที่คาดหวังและจุดตรวจ:**

- 674259009@webmail.npru.ac.th เห็นเฉพาะ notification ของผู้ใช้เลข 2 ไม่เห็น N2 Selenium ของผู้ใช้เลข 3
- อ่าน ID 2 ด้วยผู้ใช้เลข 2 ได้ 404 และ is_read ของ ID 2 ยัง 0; mark-one เปลี่ยนเฉพาะ ID 1
- read-all เปลี่ยนทุก notification ของผู้ใช้เลข 2 รวมรายการเตรียมเพิ่ม แต่ไม่เปลี่ยนผู้ใช้เลข 3; UI controls และ DB ต้องตรง
- toast อย่างเดียวไม่พอให้ผ่าน; กรณีเพิ่มรายการที่สามต้องมี manifest และ execution ใหม่

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-044

เรียก AI ช่วยเขียนทั้งสี่บริการด้วยข้อมูลจริงในชุดทดสอบและปฏิเสธคำขอไม่มี token หรือชนิดข้อมูลผิด

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- 674259009@webmail.npru.ac.th มี token ถูกต้อง; server.pymock เฉพาะ AI provider และใช้ route/schema/auth จริง
- ผล mock มาจาก AI_RESULTS ไม่เรียก provider ภายนอก
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- generate-abstract={"title_th":"Test","title_en":"Test","language":"th"}; suggest-titles={"abstract":"Test"}
- suggest-keywords={"title_th":"Test"}; check-writing={"text":"Test writing"}
- invalid ของ suggest-titles/keywords={"abstract":{"invalid":"type"}}; generate-abstract/check-writing ขาด requiredfield ใช้{}

**ขั้นตอน:**

1. ใช้ 674259009@webmail.npru.ac.th POST /ai/generate-abstract ด้วย body ที่กำหนด ตรวจ abstract="Deterministic test abstract"
2. POST /ai/suggest-titles ตรวจ suggestions=["Deterministic research title"]
3. POST /ai/suggest-keywords ตรวจ keywords=["selenium","research"]; POST /ai/check-writing ตรวจ score=90,improved_text="Test writing",issues=[]
4. เรียกทั้งสี่อีกครั้งโดยไม่ส่ง token และ body ยัง valid ต้อง 401
5. ใช้ token ถูกแต่ bodyinvalid ตามข้อมูลต้อง 422; {}ของ suggest-titles/keywords เป็น valid ตาม schema และตรวจ 200 แยกเพิ่มเติม

**ผลที่คาดหวังและจุดตรวจ:**

- validbody ทั้งสี่ได้ 200 และค่าตรง AI_RESULTS:abstract=Deterministic test abstract,suggestions=Deterministic research title,keywords[selenium,research],writing score=90
- ไม่มี token ได้ 401 ครบสี่ endpoint; invalidbody ได้ 422 ตาม schema จริง
- {}เป็น valid สำหรับ suggest-titles/keywords; language เป็น string ไม่ใช่ Literal enum จึงไม่อ้างว่า language อื่นต้อง 422

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-045

ตรวจสิทธิ์ AI สรุปแดชบอร์ดและการแชตสาธารณะค้นงานด้วยคำว่า Selenium เมื่อระบบใช้ text-search fallback

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- AI provider ถูก mock ตาม server.py; get_embedding ถูกตั้งให้เกิด RuntimeError เพื่อเข้า fallback
- งาน approved เลข 1/4/5matchSelenium; เลข 2/3 pending ต้องไม่อยู่ relevant_works
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์ — udsanee@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- POST /ai/dashboard-insights body={}ด้วย admin@uniresearch.ac.th,udsanee@webmail.npru.ac.th,674259009@webmail.npru.ac.th และ anonymous
- POST /ai/chat แบบ anonymousbody={"message":"การ","history":[]}
- mockinsight={"summary":"Deterministic dashboard insight"}; mock chat response=Deterministic chat response

**ขั้นตอน:**

1. POST dashboard-insights ด้วย admin@uniresearch.ac.th ตรวจ 200 และ summary ตรง mock
2. เพิ่มตรวจ udsanee@webmail.npru.ac.th ได้ 200; 674259009@webmail.npru.ac.th ได้ 403 และ anonymous ได้ 401
3. POST /ai/chat ไม่ส่ง token ด้วย message=Selenium/history[]โดย provider embedding failure ยังเปิดอยู่
4. ตรวจ 200,response="Deterministic chat response",relevant_works เป็น array ไม่เกิน 3 และทุก ID อยู่ใน{1,4,5}
5. ส่ง chat ขาด history เป็นกรณีเพิ่มต้อง 422; vector retrieval จริงต้องมีรอบ PostgreSQL แยก ไม่ถือว่าผ่านจาก fallback นี้

**ผลที่คาดหวังและจุดตรวจ:**

- dashboard insight ของ admin@uniresearch.ac.th และ udsanee@webmail.npru.ac.th ได้ 200/summary ตรง mock; student ได้ HTTP 403,anonymous ได้ HTTP 401
- public chat200,response=Deterministic chat response,relevant_works เป็น array ไม่เกิน 3 และ IDsubset{1,4,5}
- fallback ต้องไม่ 500; chat ขาด history422; การตรวจ vector จริงต้องใช้ PostgreSQL อีกชุด

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-046

ที่ปรึกษาเปิด AI วิเคราะห์งานเลข 1 ครบสี่แท็บและตรวจสิทธิ์ผู้ดูแล นักศึกษา ผู้ไม่เข้าสู่ระบบ และรหัสงานไม่พบ

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- งานเลข 1 มีอยู่; เพิ่ม review ของ reviewer_id=5,comment_text=AI fixture,status_result=approved,score=80,created_at=2026-10-01
- udsanee@webmail.npru.ac.th role=advisor, active;admin@uniresearch.ac.th role=admin, active;674259009@webmail.npru.ac.th role=student, active; AI provider ใช้ AI_RESULTS จริงของ server.py
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์ — udsanee@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- หน้า /advisor/reviews/1; แท็บ Pre-Review Analysis,Plagiarism Check,Reviewer Matching,Review Summary
- API POST /research/1/ai-pre-review,/ai-plagiarism,/ai-reviewer-match,/ai-review-summary; ID ไม่มี=999999999
- ผล mock เด่น:overall_score=80; similarity_score=0; matches[0].advisor_id=5/score=90; executive_summary=Deterministic review summary

**ขั้นตอน:**

1. ล็อกอิน udsanee@webmail.npru.ac.th เปิด /advisor/reviews/1 ตรวจ AI Peer Review Assistant
2. เปิด Pre-Review Analysis รอ Deterministic pre-review; เปิด Plagiarism Check รอ Deterministic similarity
3. เปิด Reviewer Matching รอ Deterministic advisor; เปิด Review Summary รอ Deterministic review summary และเก็บภาพแต่ละแท็บ
4. POST ทั้งสี่ endpoint ด้วย udsanee@webmail.npru.ac.th และเพิ่มตรวจ admin@uniresearch.ac.th เทียบ keys/ค่าจาก AI_RESULTS ใน server.py
5. POST ทั้งสี่ไม่มี token ได้ 401 ด้วย 674259009@webmail.npru.ac.th ได้ 403 และด้วย udsanee@webmail.npru.ac.th แต่ ID 999999999 ได้ 404
6. ล็อกอิน 674259009@webmail.npru.ac.th เปิด /advisor/reviews/1 ตรวจ redirect ไป /account/saved และไม่มีปุ่มวิเคราะห์ AI

**ผลที่คาดหวังและจุดตรวจ:**

- ใช้สิทธิ์บัญชี udsanee@webmail.npru.ac.th และ admin@uniresearch.ac.th: ทั้งสี่ endpoint ได้ HTTP 200 และ UI ที่ปรึกษาแสดงผล mock ตามแท็บ
- pre-review overall_score=80/summary=Deterministic pre-review; plagiarism similarity_score=0/summary=Deterministic similarity
- reviewer-match มี matches[0].advisor_id=5,score=90,reason=Controlled match; review-summary มี executive_summary=Deterministic review summary,key_issues_raised=[],improvement_sentiment=Positive
- student ได้ HTTP 403,anonymous ได้ HTTP 401 และ advisor กับ ID 999999999 ได้ 404 ครบสี่ endpoint; นักศึกษาถูก redirect ไป /account/saved
- AI endpoint ปัจจุบันตรวจ role แต่ไม่บังคับ advisor ที่ได้รับมอบหมาย ไม่อ้างสิทธิ์แคบกว่าที่โค้ดทำ

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-047

นักศึกษาส่ง การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) แล้วที่ปรึกษาอนุมัติผ่านคิวจนผู้ส่งเห็นสถานะเผยแพร่

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- 674259009@webmail.npru.ac.th ผู้ใช้เลข 2 และ udsanee@webmail.npru.ac.th ผู้ใช้เลข 5 active; category_id=1 และ options พร้อม
- ไม่มีงานชื่อ การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) ก่อนเริ่ม; ใช้ session แยกหรือลบ cookie ก่อนสลับบัญชี
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th; ผศ.ดร.อุษณีย์ ภักดีตระกูลวงศ์ — udsanee@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- title_th=การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน); title_en=Development of a Digital Repository for Educational Research in Higher Education Institutions; ผู้เขียน ผู้ใช้เลข 2; ที่ปรึกษา ผู้ใช้เลข 5; ข้อมูลอื่นและ cover.png/paper.pdf เหมือน TC-022
- ผลตรวจ approved,score=80,comment_text=Selenium verified review; รับ research_id ใหม่จากงานที่สร้างจริง

**ขั้นตอน:**

1. ล็อกอิน 674259009@webmail.npru.ac.th ส่งงานชื่อ การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) ผ่าน /student/research/new ครบห้าขั้นและรับ id จริง
2. ตรวจ pending/relations/ไฟล์ใน DB แล้วเปิด /student/research ตรวจชื่องานใหม่
3. สลับล็อกอิน udsanee@webmail.npru.ac.th และตรวจ GET pending มี id ใหม่ จากนั้นเปิด /advisor/reviews คลิกลิงก์งานชื่อเดียวกัน
4. เลือก approved กรอก 80/Selenium verified review และยืนยัน modal รอสำเร็จ ตรวจรายละเอียดแสดง “อนุมัติแล้ว”
5. กลับ 674259009@webmail.npru.ac.th เปิด /student/research ตรวจชื่อเดิมมีสถานะ “เผยแพร่แล้ว” และ DB approved/reviewer_id=5
6. เงื่อนไขเพิ่ม:ตรวจ notification ของผู้ส่งและค้นงานใหม่แบบ anonymous หลัง approved โดยไม่อ้างว่าตรวจแล้วจาก baseline ที่ไม่มี assertion นี้

**ผลที่คาดหวังและจุดตรวจ:**

- ID งานใหม่เดียวกันตลอด workflow และ status=pending→approved
- reviewer_id=5/score=80 และ comment_text=Selenium verified review/published_at บันทึก; author เป็น ผู้ใช้เลข 2 /advisor เป็น ผู้ใช้เลข 5 และไฟล์ถูกต้อง
- UI advisor แสดงอนุมัติแล้ว; UI student แสดง การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา (สำเนาทดสอบส่งและตรวจประเมิน) เป็นเผยแพร่แล้ว
- notification และค้นสาธารณะหลัง approved เป็น assertions เพิ่ม ต้องมีผลรันใหม่ก่อนอ้างว่าตรวจครบ

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



## TC-048

ผู้ดูแลระบบเพิ่ม E2E Selenium Category และบัญชี 674259002@webmail.npru.ac.th ผ่านเว็บพร้อมปฏิเสธ API จัดการของนักศึกษา

**ขอบเขตข้อมูลและคำขอเดิมของฉบับทบทวน:**



- admin@uniresearch.ac.th role=admin, active;674259009@webmail.npru.ac.th role=student, active; ไม่มี E2E Selenium Category และ 674259002@webmail.npru.ac.th
- ใช้ browser คนละ session หรือเคลียร์ cookie ก่อนสลับผู้ใช้; เก็บจำนวน users/categories ก่อนคำขอนักศึกษา
- ชื่อตาม CSV ที่ต้องเลือกให้ตรงอีเมล: นรงศ์ศักดิ์ ภูมิประเสริฐ — 674259009@webmail.npru.ac.th

**ข้อมูลทดสอบ:**

- หมวดหมู่ใหม่ category_name=E2E Selenium Category,description=Created through Selenium
- ผู้ใช้ใหม่ email=674259002@webmail.npru.ac.th,first_name=ชญานนท์,last_name=อารีย์,role=student,password=ค่ารอบทดสอบ
- คำขอปฏิเสธ:POST /users/ใช้ email=674259011@webmail.npru.ac.th; POST /categories/ใช้ category_name=Denied E2E

**ขั้นตอน:**

1. ล็อกอิน admin@uniresearch.ac.th เปิด /admin/categories สร้าง E2E Selenium Category พร้อมคำอธิบาย
2. เปิด /admin/users กดเพิ่มผู้ใช้ใหม่ กรอก 674259002@webmail.npru.ac.th ชื่อ ชญานนท์ นามสกุล อารีย์ รหัสรอบทดสอบ role student แล้วบันทึก
3. GET categories และ GET /users/ID ที่สร้างด้วย admin ตรวจข้อมูลตรงและเก็บจำนวนแถว
4. logout แล้วล็อกอิน 674259009@webmail.npru.ac.th เปิด /admin บันทึก URL/หน้าแสดงจริงเป็น observation ของ route guard
5. ส่ง GET /users/,POST /users/สร้าง 674259011@webmail.npru.ac.th และ POST /categories/สร้าง Denied E2E ด้วย token นักศึกษา ทุกคำขอต้อง 403
6. ตรวจจำนวนผู้ใช้/หมวดหมู่ไม่เพิ่มจากคำขอนักศึกษา แต่รายการที่ admin สร้างยังอยู่

**ผลที่คาดหวังและจุดตรวจ:**

- E2E Selenium Category และ 674259002@webmail.npru.ac.th สร้างผ่าน UI และ persist จริง; user ใหม่ role=student
- studentGET/POST users และ POSTcategories ได้ 403 ทั้งหมด ไม่เพิ่ม 674259011@webmail.npru.ac.th หรือ Denied E2E
- หน้า /admin ของ student ให้บันทึกตามจริงเพราะ layout ตรวจ session; ไม่สรุปว่า UIRBAC ครบเพียงเพราะ API ปฏิเสธ

**หลักฐาน/การคืนสภาพ:** ใช้ข้อ 1.3 เก็บ UI/API และ snapshot เฉพาะข้อมูล/ไฟล์ข้างต้น; reset fixture และ session หลังจบ โดยคงไฟล์หลักฐานไว้



