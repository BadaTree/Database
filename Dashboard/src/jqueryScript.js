/* Java script Document */

/* JQuery */
jQuery(document).ready(function () {

    /* 모달 박스  */
    $(".menu_btn").click(function () {
        $("#modal").addClass("active");
    });
    $(".modal_btn").click(function () {
        $("#modal").removeClass("active");
    });

    $(".keyword").click(function () {
        $(".link_search_close").css("display", "block");
        $(".pubpoint_shortcut").css("display", "block");
        $(".room_list").css("display", "block");
    });

    /* 검색창 */
    $(document).ready(function () {
        //selectbox만들기               
        for (let i = 0; i < hanaJson.data.Floors[0].RoomArea.length; i++) {
          let = roomName= hanaJson.data.Floors[0].RoomArea[i].Name
          $('#goal').append('<option value="' + i +  '">' + i +'-'+ roomName + '</option>');
        }
      })



    // $(".link_search_close").click(function () {
    //     $(".link_search_close").css("display", "none");
    //     $(".pubpoint_shortcut").css("display", "none");
    //     $(".room_list").css("display", "none");
    // });

    // $(".list_recomm").click(function () {
    //     $(".NaviBottom").css("display", "block");
    // });
    // $("#Naviclose").click(function () {
    //     $(".NaviBottom").css("display", "none");
    // });
    // $('#goalBox').ready(function () {
        
    //         var dt = new Date(); var year = ""; var com_year = dt.getFullYear();
    //         $("#YEAR").append("<option value=''>년도</option>");

    //         for (var y = (com_year - 1); y <= (com_year + 5); y++) { $("#YEAR").append("<option value='" + y + "'>" + y + " 년" + "</option>"); }

    //         var month; $("#MONTH").append("<option value=''>월</option>"); for (var i = 1; i <= 12; i++) { $("#MONTH").append("<option value='" + i + "'>" + i + " 월" + "</option>"); }
        
    // });

});



/* 버튼 이벤트 */
// let angleBtn = document.querySelector('#button4');
// angleBtn.addEventListener('click', function () {
//     angleBtn.classList.toggle('toggleBtn');
// });