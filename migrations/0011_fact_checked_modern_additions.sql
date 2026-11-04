-- P2 #16: refresh the four intentional 2026 modern additions with current,
-- concept-level copy grounded in official tourism sources. The records remain
-- `modern-addition`; no legacy `source_ref` is assigned because they do not map
-- to a historical WordPress subject.
--
-- Sources read for this migration are recorded in docs/P2_2026_FACT_SOURCES.md.
-- Commercial details (prices, departures, availability, operators) are not
-- asserted here and remain represented by the live booking data.

update destinations
set excerpt_en = 'A temple town between Angkor and the Tonlé Sap, with a walkable old quarter and lake villages.',
    excerpt_vn = 'Thị trấn đền đài giữa Angkor và Biển Hồ, với khu phố cổ đi bộ được và những làng trên hồ.',
    body_en = 'Siem Reap sits about seven kilometres south of Angkor Wat, on the plain between the Tonlé Sap and the Kulen hills. Angkor Wat, Angkor Thom with the Bayon, and Ta Prohm form the essential temple group, while the Tonlé Sap adds floating and stilted villages such as Kompong Phluk and Kompong Khleang. In town, the old French Quarter, Psar Chas market, the riverside and the Angkor National Museum give the days around the temples their own shape.',
    body_vn = 'Xiêm Riệp nằm cách Angkor Wat khoảng bảy ki-lô-mét về phía nam, trên vùng đồng bằng giữa Biển Hồ và dãy núi Kulen. Angkor Wat, Angkor Thom cùng Bayon và Ta Prohm tạo thành nhóm đền chính, trong khi Biển Hồ có thêm những làng nổi và làng nhà sàn như Kompong Phluk và Kompong Khleang. Trong thị trấn, khu phố Pháp cũ, chợ Psar Chas, bờ sông và Bảo tàng Quốc gia Angkor tạo nên nhịp riêng cho những ngày quanh đền.'
where id = 'siemreap';

update destinations
set excerpt_en = 'A city of temples, palaces and markets, from Wat Pho and Wat Arun to Chatuchak and Yaowarat.',
    excerpt_vn = 'Thành phố của đền chùa, cung điện và chợ, từ Wat Pho, Wat Arun đến Chatuchak và Yaowarat.',
    body_en = 'Bangkok brings together historic and religious sites with palaces, museums, parks and markets. Wat Phra Kaew, Wat Pho, Wat Arun, the Golden Mountain and Wat Ratchanadda are part of that temple landscape, while Chatuchak, Sampeng and the Yaowarat and Phahurat night markets show the market side of the city.',
    body_vn = 'Bangkok kết hợp các di tích lịch sử, tôn giáo với cung điện, bảo tàng, công viên và chợ. Wat Phra Kaew, Wat Pho, Wat Arun, Golden Mountain và Wat Ratchanadda là một phần của cảnh quan đền chùa ấy, trong khi Chatuchak, Sampeng cùng chợ đêm Yaowarat và Phahurat cho thấy nhịp chợ của thành phố.'
where id = 'bangkok';

update tours
set excerpt_en = 'Five days among the Angkor temples, from first light at Angkor Wat to the Tonlé Sap.',
    excerpt_vn = 'Năm ngày giữa quần thể đền Angkor, từ ánh sáng đầu tiên ở Angkor Wat đến Biển Hồ.',
    body_en = 'Five days built around the Angkor Archaeological Park, with Siem Reap town as the base. Begin with Angkor Wat, the largest religious monument in the world, built by Suryavarman II in the early twelfth century within a moat and a 3.6-kilometre outer wall. Continue to Angkor Thom for the Bayon''s stone faces and bas-reliefs, then Ta Prohm, where silk-cotton roots hold parts of the temple. Give the Tonlé Sap its own day: the lake, its river link to the Mekong and villages such as Kompong Phluk and Kompong Khleang show a different side of the region.',
    body_vn = 'Năm ngày xoay quanh Công viên Khảo cổ Angkor, lấy thị trấn Xiêm Riệp làm điểm dừng chân. Bắt đầu với Angkor Wat, công trình tôn giáo lớn nhất thế giới, do Suryavarman II xây dựng vào đầu thế kỷ 12, nằm trong hào nước và vòng tường ngoài dài 3,6 ki-lô-mét. Tiếp tục đến Angkor Thom để xem những gương mặt đá và phù điêu của Bayon, rồi Ta Prohm, nơi rễ cây gòn vẫn ôm một phần ngôi đền. Dành riêng một ngày cho Biển Hồ: hồ nước, dòng sông nối với Mekong và những làng nổi, làng nhà sàn như Kompong Phluk và Kompong Khleang cho thấy một mặt khác của vùng đất.'
where id = 'angkor-dawn';

update tours
set excerpt_en = 'A limestone valley of rice terraces, stilt villages and forest walks in Pu Luong Nature Reserve.',
    excerpt_vn = 'Thung lũng đá vôi với ruộng bậc thang, làng nhà sàn và những lối đi trong rừng ở Khu bảo tồn thiên nhiên Pù Luông.',
    body_en = 'Pu Luong Nature Reserve was established in 1999 and protects more than 17,600 hectares of limestone mountains, tropical forest and cultivated rice terraces. Thai and Muong communities live in the reserve, many in stilt houses; village paths cross the terraces, and waterwheels and waterfalls sit within the reserve. The journey is built around walking, with time in the villages and a landscape that is still farmed.',
    body_vn = 'Khu bảo tồn thiên nhiên Pù Luông được thành lập năm 1999, bảo vệ hơn 17.600 héc-ta núi đá vôi, rừng nhiệt đới và ruộng bậc thang đang canh tác. Người Thái và người Mường sống trong khu bảo tồn, nhiều gia đình ở nhà sàn; những lối đi trong bản chạy qua ruộng bậc thang, còn guồng nước và thác nằm trong khu bảo tồn. Hành trình xoay quanh việc đi bộ, có thời gian ở lại trong bản và nhìn một cảnh quan vẫn đang được canh tác.'
where id = 'puluong';
