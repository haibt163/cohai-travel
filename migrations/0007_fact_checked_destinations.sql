-- P2 #12: refresh the first source-backed destination set with current,
-- independently checked facts. This migration preserves the canonical ids/slugs
-- and existing media while replacing synthetic wording with current destination copy.
-- Fact sources are recorded in docs/P2_2026_FACT_SOURCES.md.

update destinations
set excerpt_en = 'A thousand-year capital of old lanes, lakes, street food and contemporary city life.',
    excerpt_vn = 'Thủ đô nghìn năm với phố cũ, hồ, ẩm thực đường phố và nhịp sống đương đại.',
    body_en = 'Hanoi has more than a thousand years of history. The Old Quarter still carries streets rooted in the city''s older trading life, while the capital now mixes neighbourhood cafes, restaurants, galleries and busy markets. Start around Hoan Kiem, walk the Old Quarter at a human pace, and leave time for the city beyond its postcard centre.',
    body_vn = 'Hà Nội có hơn một nghìn năm lịch sử. Phố cổ vẫn giữ những tuyến phố gắn với đời sống buôn bán xưa, trong khi thủ đô hôm nay đan xen quán cà phê, nhà hàng, phòng tranh và những khu chợ nhộn nhịp. Bắt đầu quanh Hồ Gươm, đi bộ phố cổ thật chậm và dành thời gian nhìn ra ngoài phần trung tâm quen thuộc.'
where id = 'hanoi';

update destinations
set excerpt_en = 'Karst islands, emerald water, cruises and caves in one of Vietnam''s signature seascapes.',
    excerpt_vn = 'Đảo đá vôi, nước xanh ngọc, du thuyền và hang động trong một cảnh quan biểu tượng của Việt Nam.',
    body_en = 'Ha Long is defined by thousands of rugged limestone islands and islets rising from emerald water. Cruising is the essential way to read the landscape: watch the karsts change with the light, explore a cave, and allow time on deck rather than rushing from stop to stop. Ha Long Bay is UNESCO-listed, and the wider Ha Long–Cat Ba heritage area now forms a connected World Heritage landscape.',
    body_vn = 'Hạ Long được định hình bởi hàng nghìn đảo và đảo nhỏ đá vôi nhô lên trên mặt nước xanh ngọc. Du thuyền là cách tự nhiên nhất để đọc cảnh quan này: ngắm đá đổi sắc theo ánh sáng, khám phá hang động và dành thời gian trên boong thay vì chạy từ điểm này sang điểm khác. Vịnh Hạ Long thuộc di sản UNESCO, còn không gian di sản Hạ Long – Cát Bà ngày nay tạo thành một cảnh quan Di sản Thế giới liên kết.'
where id = 'halong';

update destinations
set excerpt_en = 'A preserved riverside trading town of yellow facades, lanterns, food and old-world streets.',
    excerpt_vn = 'Phố cảng bên sông với nhà vàng, đèn lồng, ẩm thực và những con đường cổ.',
    body_en = 'Hoi An grew as a trading port on the Thu Bon River and remains a remarkably walkable historic town. The Old Town brings together traditional houses, pagodas, the Japanese Bridge and layers of Chinese, Japanese, European and local influence. Come early or stay late, when the lanes become easier to read without the busiest daytime traffic.',
    body_vn = 'Hội An phát triển như một thương cảng bên sông Thu Bồn và đến nay vẫn là một đô thị lịch sử rất thuận tiện để đi bộ. Phố cổ tập hợp nhà cổ, chùa, Chùa Cầu cùng những lớp ảnh hưởng của Trung Hoa, Nhật Bản, châu Âu và địa phương. Nên đến sớm hoặc ở lại muộn, khi các con phố dễ cảm nhận hơn sau nhịp đông ban ngày.'
where id = 'hoian';

update destinations
set excerpt_en = 'Imperial citadel, royal tombs, the Perfume River and a food culture with its own grammar.',
    excerpt_vn = 'Kinh thành, lăng vua, sông Hương và một nền ẩm thực có ngôn ngữ riêng.',
    body_en = 'Hue was the imperial capital of the Nguyen Dynasty, whose 143-year reign shaped the city''s citadel, palaces and royal tombs. The Perfume River gives the centre its slower rhythm. Read Hue through the Imperial City, the tomb landscapes outside town, and the food markets and small dishes that still carry the court tradition.',
    body_vn = 'Huế là kinh đô của triều Nguyễn trong 143 năm, để lại Kinh thành, cung điện và quần thể lăng tẩm. Sông Hương tạo cho trung tâm thành phố một nhịp chậm riêng. Đọc Huế qua Đại Nội, những quần thể lăng ngoài đô thị và các khu chợ, món ăn nhỏ vẫn mang dấu ấn ẩm thực cung đình.'
where id = 'hue';

update destinations
set excerpt_en = 'A mountain town above a working terrace valley, with trekking, villages and Fansipan on the skyline.',
    excerpt_vn = 'Thị trấn núi bên thung lũng ruộng bậc thang, trekking, bản làng và Fansipan trên đường chân trời.',
    body_en = 'Sapa sits at the head of a deep valley of rice terraces that are still farmed today. Trekking is one of the strongest reasons to come: follow the terraces beyond town, visit villages, and use the mountain landscape as part of the journey rather than just a backdrop. Fansipan rises above the region, while Lao Cai and the road links from Hanoi provide the practical gateways into the valley.',
    body_vn = 'Sa Pa nằm ở đầu một thung lũng sâu với những thửa ruộng bậc thang vẫn được canh tác. Trekking là một trong những lý do rõ nhất để đến đây: đi theo ruộng ra ngoài thị trấn, ghé các bản làng và coi cảnh núi là một phần của hành trình chứ không chỉ là phông nền. Fansipan nổi bật trên dãy núi, còn Lào Cai và các tuyến đường từ Hà Nội là những cửa ngõ thực tế vào thung lũng.'
where id = 'sapa';
