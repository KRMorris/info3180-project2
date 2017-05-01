$(document).ready(function(){
$('img').click(function(){
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
}
);
});