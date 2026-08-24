# -*- coding: utf-8 -*-
import json
import urllib.request
import urllib.error
import urllib.parse
import mimetypes
import uuid

API_BASE_URL = "http://localhost:8000"

def make_request(path, method="GET", headers=None, body=None):
    url = f"{API_BASE_URL}{path}"
    if headers is None:
        headers = {}
    
    req_body = None
    if body is not None:
        if isinstance(body, (dict, list)):
            req_body = json.dumps(body).encode("utf-8")
            headers["Content-Type"] = "application/json"
        elif isinstance(body, bytes):
            req_body = body
        else:
            req_body = str(body).encode("utf-8")

    req = urllib.request.Request(url, data=req_body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read()
            if response.headers.get_content_type() == "application/json":
                return json.loads(res_data.decode("utf-8")), response.status
            return res_data, response.status
    except urllib.error.HTTPError as e:
        err_data = e.read()
        try:
            err_json = json.loads(err_data.decode("utf-8"))
            print(f"HTTP Error {e.code} for {url}: {err_json}")
        except Exception:
            print(f"HTTP Error {e.code} for {url}: {err_data}")
        raise e

def encode_multipart_formdata(fields, files=None):
    boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
    body = []
    
    for key, value in fields.items():
        body.append(f"--{boundary}".encode("utf-8"))
        body.append(f'Content-Disposition: form-data; name="{key}"'.encode("utf-8"))
        body.append(b"")
        body.append(str(value).encode("utf-8"))
        
    if files:
        for key, (filename, content, mimetype) in files.items():
            if content is None:
                continue
            body.append(f"--{boundary}".encode("utf-8"))
            body.append(f'Content-Disposition: form-data; name="{key}"; filename="{filename}"'.encode("utf-8"))
            body.append(f"Content-Type: {mimetype}".encode("utf-8"))
            body.append(b"")
            body.append(content)
            
    body.append(f"--{boundary}--".encode("utf-8"))
    body.append(b"")
    
    content_type = f"multipart/form-data; boundary={boundary}"
    return b"\r\n".join(body), content_type

def main():
    print("=== Starting UniResearch Thai Language Mockup Seeding ===")
    
    # 1. Register Users
    users_to_register = [
        {
            "email": "admin@uniresearch.ac.th",
            "password": "password123",
            "role": "admin",
            "first_name": "สมชาย",
            "last_name": "แอดมิน"
        },
        {
            "email": "advisor1@uniresearch.ac.th",
            "password": "password123",
            "role": "advisor",
            "first_name": "ดร.วิชา",
            "last_name": "เชี่ยวชาญ"
        },
        {
            "email": "advisor2@uniresearch.ac.th",
            "password": "password123",
            "role": "advisor",
            "first_name": "ผศ.ดร.มานะ",
            "last_name": "หมั่นเพียร"
        },
        {
            "email": "student1@uniresearch.ac.th",
            "password": "password123",
            "role": "student",
            "first_name": "สมเกียรติ",
            "last_name": "เรียนดี",
            "student_id": "62010001",
            "department": "วิทยาการคอมพิวเตอร์"
        },
        {
            "email": "student2@uniresearch.ac.th",
            "password": "password123",
            "role": "student",
            "first_name": "วิภา",
            "last_name": "ขยันยิ่ง",
            "student_id": "62010002",
            "department": "วิศวกรรมคอมพิวเตอร์"
        }
    ]

    registered_users = {}
    tokens = {}

    for u in users_to_register:
        print(f"Registering user: {u['email']} ({u['role']})...")
        try:
            res, _ = make_request("/auth/register", "POST", body=u)
            registered_users[u["email"]] = res
        except urllib.error.HTTPError as e:
            if e.code == 400:
                print(f"User {u['email']} already registered, proceeding to login.")
            else:
                raise e

        # Login
        print(f"Logging in user: {u['email']}...")
        login_data = f"username={urllib.parse.quote(u['email'])}&password={urllib.parse.quote(u['password'])}".encode("utf-8")
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        res, _ = make_request("/auth/login", "POST", headers=headers, body=login_data)
        tokens[u["email"]] = res["access_token"]

    admin_token = tokens["admin@uniresearch.ac.th"]
    student1_token = tokens["student1@uniresearch.ac.th"]
    student2_token = tokens["student2@uniresearch.ac.th"]

    # 2. Get registered user IDs for references
    all_users = {}
    # Fetching participants from student1 perspective to get all available authors and advisors
    part_res, _ = make_request("/research/participants", "GET", headers={"Authorization": f"Bearer {student1_token}"})
    for author in part_res["authors"]:
        all_users[author["email"]] = author["id"]
    for advisor in part_res["advisors"]:
        all_users[advisor["email"]] = advisor["id"]

    # 3. Create Categories
    categories = [
        {"category_name": "วิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์", "description": "การวิจัยและนวัตกรรมทางด้านคอมพิวเตอร์ ปัญญาประดิษฐ์ การประมวลผลข้อมูล และเครือข่าย"},
        {"category_name": "วิศวกรรมศาสตร์และนาโนเทคโนโลยี", "description": "การพัฒนาและประยุกต์ใช้องค์ความรู้ทางวิศวกรรมและเทคโนโลยีระดับนาโน"},
        {"category_name": "วิทยาศาสตร์ข้อมูลเชิงประยุกต์", "description": "การประยุกต์ใช้วิทยาการข้อมูลเพื่อแก้ไขปัญหาจริงในอุตสาหกรรม"},
        {"category_name": "เทคโนโลยีการศึกษาและนวัตกรรมการเรียนรู้", "description": "การวิจัยเครื่องมือและระบบการสอนยุคใหม่"}
    ]

    category_ids = []

    print("Creating / loading categories...")

    # ดึง categories ที่มีอยู่ก่อน
    existing_categories, _ = make_request(
        "/categories/",
        "GET",
        headers={"Authorization": f"Bearer {admin_token}"}
    )

    existing_map = {
        cat["category_name"]: cat["id"]
        for cat in existing_categories
    }

    for cat in categories:
        category_name = cat["category_name"]

        if category_name in existing_map:
            category_id = existing_map[category_name]
            print(
                f"Category already exists: "
                f"{category_name} (ID: {category_id})"
            )
        else:
            res, _ = make_request(
                "/categories/",
                "POST",
                headers={
                    "Authorization": f"Bearer {admin_token}"
                },
                body=cat
            )

            category_id = res["id"]

            print(
                f"Created category: "
                f"{res['category_name']} (ID: {category_id})"
            )

        category_ids.append(category_id)

    # Dummy file bytes
    dummy_cover = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc`\x00\x00\x00\x02\x00\x01H\xaf\xa4q\x00\x00\x00\x00IEND\xaeB`\x82"
    dummy_pdf = b"%PDF-1.4\n%EOF"

    # 4. Create Research Papers (Mock Data in Thai Language)
    research_papers = [
        {
            "submitter_token": student1_token,
            "fields": {
                "title_th": "การพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยอัตโนมัติโดยใช้ปัญญาประดิษฐ์",
                "title_en": "Development of an Automatic Research Topic Recommendation System using Artificial Intelligence",
                "category_id": category_ids[0],
                "abstract": "งานวิจัยนี้นำเสนอการพัฒนาระบบแนะนำหัวข้อโครงงานวิจัยวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์อัตโนมัติ สำหรับนักศึกษาและอาจารย์ เพื่อเป็นตัวช่วยในการค้นหาแนวทางการตั้งโจทย์วิจัยที่เหมาะสม โดยการวิเคราะห์ข้อมูลความสนใจ ทักษะ และประวัติการทำโครงงานก่อนหน้าของผู้ใช้งาน ระบบใช้โมเดลโครงข่ายประสาทเทียมลึก (Deep Neural Networks) ในการประมวลผลภาษาธรรมชาติของบทคัดย่อภาษาไทยและภาษาอังกฤษ ผลสัมฤทธิ์พบว่ามีความถูกต้องในการแนะนำหัวข้อที่ผู้ใช้พึงพอใจสูงถึงร้อยละ 87.5",
                "department": "วิทยาการคอมพิวเตอร์",
                "work_type": "วิทยานิพนธ์",
                "academic_year": 2568,
                "keywords": "ปัญญาประดิษฐ์, ระบบแนะนำ, การประมวลผลภาษาธรรมชาติ, โครงงานวิจัย",
                "author_ids": json.dumps([all_users["student1@uniresearch.ac.th"]]),
                "advisor_ids": json.dumps([all_users["advisor1@uniresearch.ac.th"]])
            },
            "files": {
                "cover_image": ("cover1.png", dummy_cover, "image/png"),
                "document": ("abstract1.pdf", dummy_pdf, "application/pdf")
            },
            "review": {
                "reviewer_email": "advisor1@uniresearch.ac.th",
                "comment_text": "เนื้อหาดีมาก มีความเป็นระบอบระเบียบ มีการวิเคราะห์ผลลัพธ์ที่ชัดเจนและครอบคลุม อนุมัติให้เผยแพร่ได้",
                "status_result": "approved"
            }
        },
        {
            "submitter_token": student2_token,
            "fields": {
                "title_th": "การศึกษาประสิทธิภาพของโมเดลการประมวลผลภาษาธรรมชาติบนสถาปัตยกรรมหม้อแปลงสำหรับการจัดหมวดหมู่งานวิจัยภาษาไทย",
                "title_en": "Performance Evaluation of Transformer-based NLP Models for Thai Research Document Classification",
                "category_id": category_ids[0],
                "abstract": "เอกสารวิจัยนี้นำเสนอการประเมินและเปรียบเทียบประสิทธิภาพของสถาปัตยกรรมโมเดล Transformer ประเภทต่างๆ เช่น WangchanBERTa และ Multilingual BERT ในการทำความเข้าใจและคัดแยกหมวดหมู่เอกสารงานวิจัยวิชาการภาษาไทย ผลการทดลองบนคลังข้อมูลขนาด 5,000 ชิ้นแสดงให้เห็นว่าการปรับจูนไฮเปอร์พารามิเตอร์แบบกำหนดเองให้ผลลัพธ์ที่มีคะแนน F1-score สูงถึง 91.2% ซึ่งเป็นประโยชน์อย่างมากต่อการนำไปใช้งานในคลังห้องสมุดดิจิทัลแบบอัตโนมัติ",
                "department": "วิศวกรรมคอมพิวเตอร์",
                "work_type": "วิทยานิพนธ์",
                "academic_year": 2567,
                "keywords": "การประมวลผลภาษาธรรมชาติ, สถาปัตยกรรมหม้อแปลง, การจัดหมวดหมู่เอกสาร, ภาษาไทย",
                "author_ids": json.dumps([all_users["student2@uniresearch.ac.th"]]),
                "advisor_ids": json.dumps([all_users["advisor2@uniresearch.ac.th"]])
            },
            "files": {
                "cover_image": ("cover2.png", dummy_cover, "image/png"),
                "document": ("abstract2.pdf", dummy_pdf, "application/pdf")
            },
            "review": {
                "reviewer_email": "advisor2@uniresearch.ac.th",
                "comment_text": "การวิเคราะห์โมเดลละเอียดดีมาก ข้อคิดเห็นเพิ่มคือควรเพิ่มเปรียบเทียบกับโมเดลแบบเดิมอีกเล็กน้อยในบทความหลัก แต่อยู่ในเกณฑ์ดีมาก อนุมัติ",
                "status_result": "approved"
            }
        },
        {
            "submitter_token": student1_token,
            "fields": {
                "title_th": "การออกแบบตัววัดเซ็นเซอร์แบบประหยัดพลังงานสำหรับระบบเกษตรอัจฉริยะในพื้นที่ห่างไกล",
                "title_en": "Energy-Efficient Sensor Design for Smart Agriculture in Remote Areas",
                "category_id": category_ids[1],
                "abstract": "โครงงานนี้นำเสนอแนวทางการออกแบบตัวประมวลผลและเซ็นเซอร์วัดความชื้นในดินและอุณหภูมิที่ทำงานโดยใช้พลังงานต่ำมาก (Ultra-low power) เพื่อใช้กับระบบฟาร์มอัจฉริยะในท้องถิ่นชนบทห่างไกลที่ไม่มีไฟฟ้าและสัญญาณอินเทอร์เน็ตที่เสถียร โดยส่งสัญญาณผ่านโปรโตคอล LoRaWAN ทำให้แบตเตอรี่หนึ่งก้อนสามารถใช้งานได้ยาวนานเกิน 3 ปี",
                "department": "วิทยาการคอมพิวเตอร์",
                "work_type": "โครงงานวิจัย",
                "academic_year": 2568,
                "keywords": "เกษตรอัจฉริยะ, พลังงานต่ำ, เซ็นเซอร์, LoRaWAN",
                "author_ids": json.dumps([all_users["student1@uniresearch.ac.th"]]),
                "advisor_ids": json.dumps([all_users["advisor1@uniresearch.ac.th"]])
            },
            "files": {
                "cover_image": ("cover3.png", dummy_cover, "image/png"),
                "document": ("abstract3.pdf", dummy_pdf, "application/pdf")
            },
            "review": {
                "reviewer_email": "advisor1@uniresearch.ac.th",
                "comment_text": "เป็นผลงานที่มีการทดสอบและสร้างต้นแบบขึ้นจริง มีความสมบูรณ์สูงมาก อนุมัติ",
                "status_result": "approved"
            }
        },
        {
            "submitter_token": student2_token,
            "fields": {
                "title_th": "การพัฒนาคลังความรู้ดิจิทัลเพื่อการสืบค้นงานวิจัยทางการศึกษาของสถาบันอุดมศึกษา",
                "title_en": "Development of a Digital Repository for Educational Research in Higher Education Institutions",
                "category_id": category_ids[3],
                "abstract": "การวิจัยครั้งนี้มีวัตถุประสงค์เพื่อพัฒนาแพลตฟอร์มคลังความรู้ดิจิทัลสำหรับรวบรวมและเปิดให้ดาวน์โหลดผลงานวิจัยนวัตกรรมการเรียนรู้ของบุคลากรทางการศึกษา ระบบมีส่วนช่วยในการแบ่งปันและแลกเปลี่ยนความรู้ระหว่างมหาวิทยาลัยได้อย่างมีประสิทธิภาพ",
                "department": "วิศวกรรมคอมพิวเตอร์",
                "work_type": "วิทยานิพนธ์",
                "academic_year": 2568,
                "keywords": "คลังความรู้ดิจิทัล, ผลงานวิจัยทางการศึกษา, การจัดการความรู้",
                "author_ids": json.dumps([all_users["student2@uniresearch.ac.th"]]),
                "advisor_ids": json.dumps([all_users["advisor2@uniresearch.ac.th"]])
            },
            "files": {
                "cover_image": ("cover4.png", dummy_cover, "image/png"),
                "document": ("abstract4.pdf", dummy_pdf, "application/pdf")
            },
            "review": {
                "reviewer_email": "advisor2@uniresearch.ac.th",
                "comment_text": "เนื้อหาดีและน่าสนใจมาก รูปแบบการพัฒนาคลังข้อมูลครอบคลุมความปลอดภัยและการใช้งานง่ายดี ผ่านเกณฑ์",
                "status_result": "approved"
            }
        }
    ]

    for index, paper in enumerate(research_papers):
        print(f"\nSubmitting research paper #{index + 1}: {paper['fields']['title_th']}...")
        multipart_body, content_type = encode_multipart_formdata(paper["fields"], paper["files"])
        headers = {
            "Authorization": f"Bearer {paper['submitter_token']}",
            "Content-Type": content_type
        }
        res, _ = make_request("/research/", "POST", headers=headers, body=multipart_body)
        research_id = res["id"]
        print(f"Successfully submitted! Research ID: {research_id}")

        # Review
        rev = paper["review"]
        reviewer_token = tokens[rev["reviewer_email"]]
        print(f"Reviewing research ID: {research_id} as {rev['reviewer_email']}...")
        review_data = {
            "comment_text": rev["comment_text"],
            "status_result": rev["status_result"]
        }
        headers_rev = {
            "Authorization": f"Bearer {reviewer_token}",
            "Content-Type": "application/json"
        }
        res_rev, _ = make_request(f"/research/{research_id}/review", "POST", headers=headers_rev, body=review_data)
        print(f"Status set to: {res_rev['status_result']}")

    print("\n=== Seeding Completed Successfully! ===")

if __name__ == "__main__":
    main()
