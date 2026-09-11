-- P2 #14: replace synthetic-sounding wording in the first source-backed
-- journeys with current, concept-level itinerary copy. Commercial details remain
-- represented by live departures/pricing and are not asserted here.
-- Current evidence is recorded in docs/P2_2026_FACT_SOURCES.md.

update tours
set excerpt_en = 'A slow reading of Ha Long Bay by overnight cruise, with karsts, caves and time on the water.',
    excerpt_vn = 'Đọc chậm Vịnh Hạ Long bằng hành trình ngủ đêm, giữa núi đá vôi, hang động và mặt nước.',
    body_en = 'A three-day Ha Long journey built around an overnight cruise. Leave Hanoi for the bay, spend time on the water among the limestone islands and allow room for a cave visit, a quiet cove and the changing light. The point is the seascape itself, not a checklist of stops.',
    body_vn = 'Hành trình ba ngày tới Hạ Long, xoay quanh một đêm trên vịnh. Rời Hà Nội để ra vịnh, dành thời gian giữa những đảo đá vôi và chừa khoảng cho hang động, một vũng yên và ánh sáng thay đổi theo ngày. Điều quan trọng là cảnh quan, không phải một danh sách điểm phải ghé.'
where id = 'junk-halong';

update tours
set excerpt_en = 'Imperial Hue, the Perfume River and the lantern-lit streets of Hoi An, joined as one central-Vietnam arc.',
    excerpt_vn = 'Huế kinh đô, sông Hương và những con phố đèn lồng Hội An trong một cung đường miền Trung.',
    body_en = 'A six-day central-Vietnam arc that begins with Hue''s imperial legacy, follows the Perfume River and crosses the Hai Van corridor toward Hoi An. Read the region slowly: spend time in the historic centres, make room for the landscape between them, and let Hoi An''s river streets close the journey.',
    body_vn = 'Cung đường sáu ngày qua miền Trung, bắt đầu với di sản kinh đô Huế, theo sông Hương rồi qua hành lang Hải Vân về Hội An. Đi chậm để đọc vùng đất: dành thời gian ở các trung tâm lịch sử, nhìn cảnh quan giữa hai nơi và kết thúc bên những con phố ven sông của Hội An.'
where id = 'hue-hoian';

update tours
set excerpt_en = 'A three-day walking introduction to Hanoi through the Old Quarter, historic sites, food and everyday street life.',
    excerpt_vn = 'Ba ngày đi bộ Hà Nội qua phố cổ, di tích, ẩm thực và nhịp sống đường phố.',
    body_en = 'Three days on foot in Hanoi. Start around Hoan Kiem and the Old Quarter, continue to historic cultural sites, and leave generous time for street food and neighbourhood life. The route is designed to read the city at walking speed rather than from a coach window.',
    body_vn = 'Ba ngày đi bộ ở Hà Nội. Bắt đầu quanh Hồ Gươm và phố cổ, tiếp tục tới các điểm văn hóa lịch sử, rồi chừa nhiều thời gian cho ẩm thực đường phố và đời sống khu phố. Hành trình được thiết kế để cảm nhận thành phố ở tốc độ đi bộ thay vì qua cửa kính xe.'
where id = 'hanoi-heritage';

update tours
set excerpt_en = 'A walking-focused week through Sapa''s terrace country, village paths and mountain landscapes.',
    excerpt_vn = 'Một tuần đi bộ qua ruộng bậc thang, đường bản và cảnh núi Sa Pa.',
    body_en = 'Eight days built around walking in the Sapa area. Follow terrace paths beyond the town, spend time in villages, and let the mountain weather shape the pace. The journey keeps the emphasis on landscape and local life; exact walking conditions should be checked for the dates selected.',
    body_vn = 'Tám ngày xoay quanh việc đi bộ ở khu vực Sa Pa. Theo những lối mòn qua ruộng ra ngoài thị trấn, dành thời gian trong các bản làng và để thời tiết miền núi quyết định nhịp đi. Hành trình đặt trọng tâm vào cảnh quan và đời sống địa phương; điều kiện đi bộ cụ thể cần được kiểm tra theo ngày đã chọn.'
where id = 'sapa-terraces';

update tours
set excerpt_en = 'A slower Mekong journey shaped by waterways, cycling, markets, fruit gardens and village life.',
    excerpt_vn = 'Một hành trình chậm ở Mekong qua sông nước, xe đạp, chợ, vườn cây và đời sống làng quê.',
    body_en = 'A six-day reading of the Mekong Delta. Move between waterways and country roads, make time for markets and orchards, and use cycling or small-boat travel where it suits the route. The delta works best when you stay long enough to notice the landscape rather than rushing through a single highlight.',
    body_vn = 'Sáu ngày đọc Đồng bằng sông Cửu Long. Di chuyển giữa sông nước và đường quê, dành thời gian cho chợ và vườn cây, dùng xe đạp hoặc thuyền nhỏ khi phù hợp với tuyến. Đồng bằng đáng giá nhất khi ở đủ lâu để nhận ra cảnh quan thay đổi thay vì chỉ chạy qua một điểm nổi bật.'
where id = 'mekong-slow';

update tours
set excerpt_en = 'Five days on Phu Quoc balancing beaches with the island''s food, farming and forested side.',
    excerpt_vn = 'Năm ngày ở Phú Quốc, cân bằng biển với ẩm thực, nông nghiệp và phần nội đảo nhiều cây xanh.',
    body_en = 'Five days that use Phu Quoc''s coast as a base while making room for the island beyond the beach. Spend time with the local food culture, see pepper and fish-sauce traditions, and leave space for a quieter northern or forested outing when conditions suit. The balance is the point: resort time and island life in the same journey.',
    body_vn = 'Năm ngày lấy bờ biển Phú Quốc làm nền nhưng vẫn dành chỗ cho phần đảo phía sau bãi cát. Tìm hiểu ẩm thực địa phương, câu chuyện hồ tiêu và nước mắm, rồi chừa một ngày cho phía bắc hoặc vùng rừng khi điều kiện phù hợp. Điểm chính là sự cân bằng giữa nghỉ dưỡng và đời sống đảo.'
where id = 'phuquoc-drift';

update tours
set excerpt_en = 'A seven-day coast-hopping concept linking Hoi An, the central coast and Nha Trang.',
    excerpt_vn = 'Một ý tưởng bảy ngày nối Hội An, dải duyên hải miền Trung và Nha Trang.',
    body_en = 'A seven-day central-coast concept linking historic Hoi An with the beaches and bays farther south. The route uses road and sea travel to keep the landscape visible between stops, with Nha Trang as the final coastal base. Specific transport, stop order and water activities depend on the dates and operating conditions.',
    body_vn = 'Một ý tưởng bảy ngày nối Hội An lịch sử với những bãi biển và vịnh phía nam. Tuyến kết hợp đường bộ và đường biển để giữ cảnh quan hiện diện giữa các điểm dừng, kết thúc ở Nha Trang. Phương tiện cụ thể, thứ tự điểm dừng và hoạt động trên nước phụ thuộc ngày đi và điều kiện vận hành.'
where id = 'central-coast';
