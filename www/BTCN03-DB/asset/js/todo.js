
$(document).ready(() => {

    setInterval(function(){
        var currentdate = new Date();
        var current = currentdate.getFullYear() + "-" + formatDate(currentdate);

        $('#today').text(current);

    }, 1000);

	/***
     * Format date
     * @param jsDate
     * @returns {string}
     */
    function formatDate(jsDate){
        
        return (((jsDate.getMonth()+1) < 10?("0"+(jsDate.getMonth()+1)):(jsDate.getMonth()+1)) + "-" 
            + (jsDate.getDate() < 10?("0"+jsDate.getDate()) : jsDate.getDate()) + " " 
            + (jsDate.getHours() < 10?("0"+jsDate.getHours()): jsDate.getHours()) + ":" 
            + (jsDate.getMinutes() < 10?("0"+jsDate.getMinutes()): jsDate.getMinutes()) + ":" 
            + (jsDate.getSeconds() < 10?("0"+jsDate.getSeconds()): jsDate.getSeconds())
        );
    }

    /***
     * Event Add BeforeAdd
     */
    $('#add').on('click', () => {

        // lấy thẻ before add ẩn đi và after add hiển thị ra
        $('.before-add').attr('id', 'FadeOut');
        $('.after-add').css('display', 'flex');

        // làm sạch input
        $('#content').val("");
    });
    
    
    /***
     * Event insert Item
     */
    $("#content").on('keyup', function (e) {
        if (e.keyCode == 13) {
            // y-m-d H:m:i
            let currentdate = new Date();
            const time = currentdate.getFullYear() + "-" + formatDate(currentdate);
            const doing = $('#content').val();
            
            if (doing == '') return false;

            //truyền dữ liệu lên server && lấy ID về
            $.ajax({
                url: '/todo',
                type: 'POST',
                data: {
                    name: doing,
                    time: time,
                    state: false
                },
                success: function(res) {

                    let id = res.id;
                    let todo = 
`
<div class='form-check'>
    <label id="${id}">
        <input type='checkbox' name='check'>
        <span class='label-text'>${doing}</span>
        <span class='label-text' id='timer'>${time}</span>
    </label>
</div>
 `;
                    $("#list-content").append(todo);
                },
                error: function(err) {
                    console.log(err);
                }
            });

            // làm sạch input
            $('#content').val("");
        }
    });

    /***
     * Event Close AfterAdd
     */
    $('#close').on('click', () => {

        // lấy thẻ before add hiện và after add ẩn đi
        $('.before-add').attr('id', '');
        $('.after-add').css('display', 'none');
    });

    /***
     * Event Toggle status items
     */
    $('#list-content').on('mousedown', 'label', function(e) {
        var id = $(this).attr('id');

        $.ajax({
            url: '/todo',
            type: 'PUT',
            data: {
                id: id
            },
            error: function(err) {
                console.log(err);
            }
        })
    });

});