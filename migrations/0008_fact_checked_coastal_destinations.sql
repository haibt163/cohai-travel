-- P2 #13: continue the source-backed destination fact refresh for the
-- Mekong Delta, Phu Quoc and Nha Trang. Existing ids/slugs/media remain unchanged.
-- Current evidence is recorded in docs/P2_2026_FACT_SOURCES.md.

update destinations
set excerpt_en = 'Riverways, coconut country, markets and slow travel through a working delta landscape.',
    excerpt_vn = 'Sông nước, xứ dừa, chợ và nhịp đi chậm qua một vùng đồng bằng đang sống.',
    body_en = 'The Mekong Delta is best understood from the water and the road between villages. Sampans, river cruises and cycling routes reveal coconut groves, rice fields, markets and everyday river life. Ben Tre and Cai Be are established gateways, while longer journeys can slow down further into the delta instead of treating it as a quick day trip.',
    body_vn = 'Đồng bằng sông Cửu Long dễ cảm nhận nhất từ mặt nước và những con đường nối các làng quê. Xuồng, hành trình trên sông và xe đạp đưa bạn qua vườn dừa, ruộng lúa, chợ và đời sống thường ngày ven sông. Bến Tre và Cái Bè là những cửa ngõ quen thuộc, còn các hành trình dài hơn cho phép đi sâu hơn thay vì chỉ ghé đồng bằng trong một ngày.'
where id = 'mekong';

update destinations
set excerpt_en = 'White-sand beaches, fishing villages, forests, pepper and the easy contrast between resort and island life.',
    excerpt_vn = 'Bãi cát trắng, làng chài, rừng, hồ tiêu và sự đan xen giữa nghỉ dưỡng với đời sống đảo.',
    body_en = 'Phu Quoc is known for white-sand beaches and clear water, but fishing, agriculture and forest remain part of the island''s character. The island is also home to fish sauce, pepper and pearl traditions, with protected natural areas providing another reason to leave the resort strip. Use the coast for water time, then make room for local food, village roads and the forested interior.',
    body_vn = 'Phú Quốc nổi tiếng với bãi cát trắng và làn nước trong, nhưng nghề cá, nông nghiệp và rừng vẫn là phần quan trọng của đời sống đảo. Đây cũng là nơi gắn với nước mắm, hồ tiêu và ngọc trai, trong khi các vùng tự nhiên được bảo vệ tạo thêm lý do để rời khỏi dải nghỉ dưỡng. Dành thời gian cho biển, rồi chừa chỗ cho món địa phương, đường làng và phần nội đảo nhiều cây xanh.'
where id = 'phuquoc';

update destinations
set excerpt_en = 'A south-central coastal city for beaches, islands, seafood, water sports and mud-bath traditions.',
    excerpt_vn = 'Thành phố biển Nam Trung Bộ với bãi biển, đảo, hải sản, thể thao nước và tắm bùn.',
    body_en = 'Nha Trang sits in a curved bay on Vietnam''s south-central coast. The city combines a busy beachfront with nearby islands, seafood, water sports and a long-standing mud-bath and hot-spring tradition. Read it as a coastal base: spend a morning on the water, then return for the city''s food, promenade and inland cultural stops.',
    body_vn = 'Nha Trang nằm trong một vịnh hình vòng cung ở duyên hải Nam Trung Bộ. Thành phố kết hợp bờ biển sôi động với các đảo gần bờ, hải sản, thể thao nước và truyền thống tắm bùn, suối khoáng. Hãy xem đây là một căn cứ ven biển: buổi sáng ra đảo hoặc lên nước, rồi trở về với ẩm thực, đường biển và những điểm văn hóa trong đất liền.'
where id = 'nhatrang';
