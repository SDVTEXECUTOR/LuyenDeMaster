/* ══════════════════════════════════════════════════════════════════════
   📚 KHTN.JS — CÂU HỎI KHOA HỌC TỰ NHIÊN 9
   ══════════════════════════════════════════════════════════════════════
   Giữa học kì I · 58 câu
   
   Format mỗi câu (khác 4 file data khác — dùng object):
   {
     id: number        — ID duy nhất
     q: string         — đề bài
     options: [A,B,C,D] — 4 đáp án
     answer: number    — chỉ số đáp án đúng (0=A, 1=B, 2=C, 3=D)
     refId?: number    — (tùy chọn) ID câu tham khảo cho nút "Thông tin cần thiết"
     explain?: string  — (tùy chọn) giải thích đáp án
   }
   ══════════════════════════════════════════════════════════════════════ */

export default {
  questions: [
    // ─── Chủ đề 1: Dụng cụ và báo cáo thực hành ───
    {"id":1,"q":"Dụng cụ nào phù hợp nhất để đo thể tích khoảng 25 mL nước trong thí nghiệm?","options":["Cốc thủy tinh","Ống nhỏ giọt","Đũa thủy tinh","Ống đong"],"answer":3},
    {"id":2,"q":"Khi cần lấy từng giọt dung dịch vào ống nghiệm, nên dùng dụng cụ nào?","options":["Ống nhỏ giọt","Ống đong","Phễu","Kẹp gỗ"],"answer":0},
    {"id":3,"q":"Dụng cụ nào giúp bảo vệ mắt khi thao tác với hóa chất có nguy cơ bắn tóe?","options":["Găng tay","Kính bảo hộ","Khẩu trang","Áo blouse"],"answer":1},
    {"id":4,"q":"Việc đầu tiên khi viết báo cáo khoa học là gì?","options":["Viết phần kết luận","Vẽ hình minh họa","Xác định mục đích và nội dung báo cáo","Xử lí số liệu"],"answer":2},
    {"id":5,"q":"Muốn đo nhiệt độ của một dung dịch trong thí nghiệm, dùng dụng cụ nào?","options":["Cân điện tử","Ống đong","Đồng hồ bấm giây","Nhiệt kế"],"answer":3},
    {"id":6,"q":"Dụng cụ nào thích hợp để khuấy nhẹ dung dịch trong cốc?","options":["Đũa thủy tinh","Kẹp gỗ","Ống nhỏ giọt","Phễu"],"answer":0},
    {"id":7,"q":"Khi cần cân chính xác một mẫu chất rắn, nên sử dụng dụng cụ nào?","options":["Ống đong","Cân điện tử","Nhiệt kế","Cốc chia vạch"],"answer":1},
    {"id":8,"q":"Khi trình bày báo cáo thực hành trước lớp, cần làm gì để báo cáo có tính khoa học?","options":["Chỉ nêu kết luận","Chỉ trình bày kết quả","Nêu rõ mục đích, phương pháp, kết quả có minh chứng và kết luận","Đọc nguyên văn sách giáo khoa"],"answer":2},

    // ─── Chủ đề 2: Công và công suất ───
    {"id":9,"q":"Đơn vị của công cơ học trong hệ SI là gì?","options":["Oát (W)","Niutơn (N)","Mét (m)","Jun (J)"],"answer":3},
    {"id":10,"q":"Đơn vị thường dùng để đo công suất là gì?","options":["Oát (W)","Jun (J)","Pascal (Pa)","Niutơn (N)"],"answer":0},
    {"id":11,"q":"Một lực không đổi tác dụng lên vật nhưng vật không dịch chuyển. Công của lực đó bằng bao nhiêu?","options":["Bằng 1 J","Bằng 0 J","Bằng giá trị của lực","Bằng trọng lượng của vật"],"answer":1},
    {"id":12,"q":"Công cơ học của lực không đổi cùng hướng chuyển động được tính bằng công thức nào?","options":["A = F/s","A = F + s","A = F.s","A = s/F"],"answer":2},
    {"id":13,"q":"Công suất cho biết đại lượng gì? (P = A/t)","options":["Độ lớn của lực tác dụng","Quãng đường vật đi được","Khối lượng của vật","Tốc độ thực hiện công"],"answer":3},
    {"id":14,"q":"Công thức tính động năng của vật khối lượng m, chuyển động với tốc độ v là gì?","options":["Wđ = ½mv²","Wđ = mv","Wđ = mgh","Wđ = 2mv²"],"answer":0},
    {"id":15,"q":"Công thức tính thế năng hấp dẫn của vật khối lượng m ở độ cao h gần mặt đất là gì?","options":["Wt = ½mv²","Wt = mgh","Wt = mg/h","Wt = mh/g"],"answer":1},

    // ─── Chủ đề 3: Năng lượng và sử dụng năng lượng ───
    {"id":20,"q":"Nguồn năng lượng nào sau đây là năng lượng hóa thạch?","options":["Gió","Ánh sáng Mặt Trời","Than đá","Sóng biển"],"answer":2},
    {"id":21,"q":"Dạng năng lượng nào nhận được trực tiếp từ bức xạ Mặt Trời?","options":["Năng lượng hạt nhân","Năng lượng địa nhiệt","Năng lượng thủy triều","Năng lượng Mặt Trời"],"answer":3},
    {"id":22,"q":"Đốt than trong nhà máy nhiệt điện có thể gây ô nhiễm không khí chủ yếu do đâu?","options":["Do phát thải khí và bụi","Do tiếng ồn","Do nhiệt độ nước tăng","Do ánh sáng"],"answer":0},
    {"id":23,"q":"Một lợi ích quan trọng của năng lượng gió so với than đá là gì?","options":["Trữ lượng hữu hạn","Là nguồn năng lượng tái tạo và ít phát thải khi vận hành","Phát thải nhiều khí nhà kính","Không phụ thuộc vào thời tiết"],"answer":1},
    {"id":24,"q":"Ví dụ nào là sử dụng năng lượng tái tạo?","options":["Đốt than để sưởi ấm","Chạy máy phát điện bằng dầu diesel","Dùng pin Mặt Trời tạo điện","Đốt xăng chạy xe"],"answer":2},
    {"id":25,"q":"Năng lượng trong vòng tuần hoàn nước trên Trái Đất chủ yếu bắt nguồn từ đâu?","options":["Lõi Trái Đất","Mặt Trăng","Gió","Mặt Trời"],"answer":3},
    {"id":26,"q":"Một hạn chế của năng lượng Mặt Trời là gì?","options":["Phụ thuộc vào điều kiện thời tiết","Gây ô nhiễm nặng","Trữ lượng rất ít","Không thể chuyển hóa thành điện"],"answer":0},
    {"id":27,"q":"Biện pháp nào góp phần sử dụng năng lượng hiệu quả ở trường học?","options":["Bật đèn cả ngày","Tắt thiết bị điện khi không sử dụng","Để quạt chạy khi ra khỏi lớp","Mở điều hòa và mở cửa"],"answer":1},
    {"id":28,"q":"Vì sao không nên coi than đá là nguồn năng lượng tái tạo?","options":["Vì than đá không cháy được","Vì than đá có giá rẻ","Vì than đá hình thành trong thời gian địa chất rất dài, trữ lượng hữu hạn và bị tiêu thụ nhanh hơn nhiều so với tốc độ hình thành","Vì than đá là chất khí"],"answer":2},

    // ─── Chủ đề 4: Ánh sáng — Khúc xạ ───
    {"id":29,"q":"Chiết suất của một môi trường trong suốt được xác định bằng tỉ số nào?","options":["n = v/c","n = c.v","n = c − v","n = c/v (tốc độ ánh sáng trong chân không chia cho tốc độ ánh sáng trong môi trường)"],"answer":3},
    {"id":30,"q":"Định luật khúc xạ ánh sáng mô tả mối quan hệ giữa những đại lượng nào?","options":["Góc tới và góc khúc xạ khi tia sáng đi qua mặt phân cách giữa hai môi trường","Góc tới và góc phản xạ","Tốc độ và thời gian của ánh sáng","Khối lượng và chiết suất"],"answer":0},
    {"id":31,"q":"Khi ánh sáng truyền xiên từ không khí vào nước, hiện tượng thường xảy ra là gì?","options":["Tia sáng truyền thẳng, không đổi hướng","Tia sáng bị khúc xạ tại mặt phân cách","Tia sáng bị hấp thụ hoàn toàn","Tia sáng bị phản xạ toàn phần"],"answer":1},
    {"id":32,"q":"Khi ánh sáng truyền từ nước ra không khí với góc tới nhỏ, tia khúc xạ thường lệch về phía nào so với pháp tuyến?","options":["Lệch lại gần pháp tuyến","Trùng với pháp tuyến","Lệch ra xa pháp tuyến","Vuông góc với pháp tuyến"],"answer":2},
    {"id":35,"q":"Khi tia sáng truyền từ không khí vào môi trường có chiết suất lớn hơn, tốc độ ánh sáng trong môi trường thay đổi thế nào?","options":["Tốc độ ánh sáng tăng; tia khúc xạ lệch ra xa pháp tuyến","Tốc độ ánh sáng giảm; tia khúc xạ lệch về phía pháp tuyến nếu truyền xiên","Tốc độ ánh sáng không đổi; tia sáng không bị lệch","Tốc độ ánh sáng tăng; tia khúc xạ lệch về phía pháp tuyến"],"answer":1},

    // ─── Chủ đề 5: Ánh sáng — Màu sắc ───
    {"id":36,"q":"Vật màu đỏ được chiếu bằng ánh sáng trắng thường nhìn thấy màu đỏ vì sao?","options":["Vật hấp thụ ánh sáng đỏ và phản xạ các màu khác","Vật tự phát ra ánh sáng đỏ","Vật phản xạ chủ yếu ánh sáng đỏ và hấp thụ phần lớn các thành phần màu khác","Vật cho ánh sáng trắng truyền qua hoàn toàn"],"answer":2},
    {"id":37,"q":"Khi chiếu chùm ánh sáng trắng qua lăng kính, dải màu thu được là kết quả của hiện tượng nào?","options":["Phản xạ ánh sáng","Phản xạ toàn phần","Truyền thẳng ánh sáng","Tán sắc ánh sáng"],"answer":3},
    {"id":38,"q":"Vì sao ánh sáng trắng qua lăng kính tạo thành nhiều màu?","options":["Vì các thành phần màu trong ánh sáng trắng bị khúc xạ khác nhau","Vì lăng kính có nhiều màu","Vì lăng kính hấp thụ ánh sáng trắng","Vì ánh sáng trắng bị phản xạ trên lăng kính"],"answer":0},
    {"id":39,"q":"Một tấm lọc màu xanh được chiếu bằng ánh sáng trắng, ánh sáng truyền qua chủ yếu có màu gì?","options":["Màu đỏ","Màu xanh","Màu vàng","Màu trắng"],"answer":1},

    // ─── Chủ đề 6: Thấu kính ───
    {"id":40,"q":"Tia sáng song song với trục chính đi qua thấu kính hội tụ, sau khi khúc xạ sẽ đi qua đâu?","options":["Quang tâm O","Điểm cách thấu kính 2f","Tiêu điểm ảnh chính","Truyền song song với trục chính"],"answer":2},
    {"id":41,"q":"Tia sáng đi qua quang tâm của thấu kính mỏng truyền như thế nào?","options":["Bị khúc xạ lệch mạnh","Bị phản xạ trở lại","Luôn đi qua tiêu điểm","Truyền gần như thẳng, không đổi hướng đáng kể"],"answer":3},
    {"id":42,"q":"Khi vẽ ảnh qua thấu kính hội tụ, có thể sử dụng hai tia đặc biệt nào?","options":["Tia tới song song trục chính cho tia ló đi qua tiêu điểm ảnh; tia đi qua quang tâm truyền thẳng","Tia tới qua quang tâm cho tia ló đi qua tiêu điểm; tia tới song song trục chính truyền thẳng","Hai tia tới đều song song với trục chính","Hai tia tới đều bị phản xạ tại thấu kính"],"answer":0},
    {"id":43,"q":"Vật đặt trước thấu kính hội tụ ở khoảng cách lớn hơn 2f thì ảnh có đặc điểm gì?","options":["Ảnh thật, ngược chiều, nhỏ hơn vật và nằm giữa f và 2f ở phía bên kia thấu kính","Ảnh ảo, cùng chiều, lớn hơn vật","Ảnh thật, ngược chiều, lớn hơn vật","Ảnh thật, ngược chiều, bằng vật và nằm tại 2f"],"answer":0},

    // ─── Chủ đề 7: Di truyền học ───
    {"id":44,"q":"Hiện tượng truyền đạt các tính trạng của bố mẹ, tổ tiên cho con cháu được gọi là gì?","options":["Biến dị","Di truyền","Đột biến","Chọn lọc tự nhiên"],"answer":1},
    {"id":45,"q":"Trong quá trình nghiên cứu, để phát hiện ra các quy luật di truyền, Mendel đã sử dụng đối tượng nào?","options":["Ruồi giấm","Cây ngô","Đậu Hà Lan","Chuột bạch"],"answer":2},
    {"id":46,"q":"Theo quan niệm của Mendel, nhân tố di truyền hiện đại xác định là gì?","options":["Nhiễm sắc thể","Protein","Nucleotide","Gene"],"answer":3},
    {"id":47,"q":"Cho hai cây đậu có kiểu gene là Aa và aa giao phấn với nhau. Tỉ lệ kiểu gene ở đời con sẽ là:","options":["1 Aa : 1 aa","100% Aa","1 AA : 1 aa","3 Aa : 1 aa"],"answer":0},
    {"id":48,"q":"Phép lai nào dưới đây có thể tạo ra đời con có kiểu gene AaBb?","options":["AABB × AABB","AABB × aabb","AAbb × AAbb","aabb × aabb"],"answer":1},
    {"id":49,"q":"Vì sao gene được xem là trung tâm của di truyền học?","options":["Vì gene chỉ có ở con người","Vì gene là protein","Vì gene quy định sự di truyền và biến dị ở sinh vật","Vì gene không bao giờ thay đổi"],"answer":2},

    // ─── Chủ đề 8: Nucleic acid (DNA, RNA) ───
    {"id":50,"q":"Các loại nucleotide nào sau đây cấu tạo nên phân tử RNA?","options":["Adenine, Thymine, Guanine, Cytosine","Adenine, Uracil, Thymine, Cytosine","Uracil, Thymine, Guanine, Cytosine","Adenine, Uracil, Guanine, Cytosine"],"answer":3},
    {"id":51,"q":"Nguyên tắc bổ sung trong cấu trúc của DNA dẫn đến hệ quả nào?","options":["A + G = T + C","A + T = G + C","A = G và T = C","A + C = T + A"],"answer":0},
    {"id":52,"q":"Một gene có 70 chu kì xoắn, số lượng nucleotide của gene đó là:","options":["700","1400","1050","2100"],"answer":1},
    {"id":53,"q":"DNA rất đa dạng là bởi DNA có đặc điểm nào?","options":["Chỉ có 2 loại nucleotide","Chỉ có một mạch","Có nhiều cách sắp xếp các nucleotide","Mọi phân tử DNA có kích thước giống nhau"],"answer":2},
    {"id":54,"q":"Nucleic acid là từ chung dùng để chỉ cấu trúc nào?","options":["Chỉ DNA","Chỉ RNA","Protein và DNA","DNA và RNA"],"answer":3},
    {"id":55,"q":"Hiện tượng con sinh ra khác nhau và khác với bố mẹ được gọi là:","options":["Biến dị","Di truyền","Thoái hóa","Sinh sản"],"answer":0},
    {"id":56,"q":"Khi Mendel cho lai giữa các giống đậu Hà Lan thuần chủng khác nhau về một cặp tính trạng tương phản thì tỉ lệ kiểu hình thu được ở thế hệ F2 là:","options":["1 : 1","3 : 1","1 : 2 : 1","9 : 3 : 3 : 1"],"answer":1},
    {"id":57,"q":"Một cơ thể có kiểu gene AaBB. Sau khi giảm phân, cơ thể đó sẽ tạo ra những loại giao tử nào?","options":["Aa, BB","AB, ab","AB, aB","AaBB"],"answer":2},
    {"id":58,"q":"Đơn phân cấu tạo nên nucleic acid là gì?","options":["Amino acid","Glucose","Acid béo","Nucleotide"],"answer":3},
    {"id":59,"q":"Nếu trên một mạch đơn của phân tử DNA có trật tự là –A–T–G–C–A– thì trật tự của đoạn mạch bổ sung tại vị trí đó là:","options":["–T–A–C–G–T–","–U–A–C–G–U–","–T–A–G–C–T–","–A–T–G–C–A–"],"answer":0},
    {"id":60,"q":"Một gene có chiều dài 5100 Å, chu kì xoắn của gene là:","options":["75","150","100","300"],"answer":1},
    {"id":61,"q":"Chức năng của DNA là gì?","options":["Cung cấp năng lượng cho tế bào","Xúc tác các phản ứng hóa học","Mang, bảo quản và truyền đạt thông tin di truyền","Vận chuyển oxygen"],"answer":2}
  ]
};
