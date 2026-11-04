-- P2 follow-up: add Thanh Hoa as a canonical destination and move the Pu Luong
-- journey under it. The journey keeps its id, slug, departures, price and
-- booking records; only destination_id and the misleading Sapa image change.
--
-- Thanh Hoa is an intentional 2026 modern addition, not a reconstructed legacy
-- destination, so source_ref stays null. The destination and journey images are
-- editorial plates, not photographs; no approved Pu Luong/Thanh Hoa photograph
-- exists in the repository yet.

insert into destinations (id, slug, country, title_en, title_vn, excerpt_en, excerpt_vn, body_en, body_vn, image, languages, currency, provenance_state)
values (
  'thanhhoa',
  'thanh-hoa',
  'Vietnam',
  'Thanh Hoa',
  'Thanh Hóa',
  'A province of limestone valleys, rice terraces and the Pu Luong Nature Reserve, southwest of Hanoi.',
  'Tỉnh miền núi đá vôi với ruộng bậc thang và Khu bảo tồn thiên nhiên Pù Luông, phía tây nam Hà Nội.',
  'Thanh Hóa is home to Pu Luong Nature Reserve, southwest of Hanoi. The reserve was established in 1999, protects more than 17,600 hectares of limestone mountains, tropical forest and cultivated rice terraces, and is home to Thai and Muong communities, many in stilt houses. Village paths, waterwheels and waterfalls sit within the reserve, and the province also holds the Ho Citadel, a UNESCO World Heritage site added in 2011.',
  'Thanh Hóa là nơi có Khu bảo tồn thiên nhiên Pù Luông, phía tây nam Hà Nội. Khu bảo tồn được thành lập năm 1999, bảo vệ hơn 17.600 héc-ta núi đá vôi, rừng nhiệt đới và ruộng bậc thang đang canh tác, đồng thời là nơi sinh sống của người Thái và người Mường, nhiều gia đình ở nhà sàn. Những lối đi trong bản, guồng nước và thác nằm trong khu bảo tồn; tỉnh cũng có Thành nhà Hồ, di sản thế giới UNESCO được công nhận năm 2011.',
  '/media/dest-thanhhoa.svg',
  'Vietnamese, English',
  'VND',
  'modern-addition'
)
on conflict (id) do nothing;

update tours
set destination_id = 'thanhhoa',
    image = '/media/dest-thanhhoa.svg'
where id = 'puluong';
