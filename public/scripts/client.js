$(function(){
    getOwners();
    getPets();
    $('#owner').on('submit', registerOwner);
    $('#pet').on('submit', registerPet);
    $('#visits').on('click', '.delete', deleteRow);
    $('#visits').on('click', '.save', updateRow);
    $('#visits').on('click', '.checkIn', updateStatus);


});

function getPets(){
    $.ajax({
         type:'GET',
        url:'/pet',
        success: displayPets

    });

}

function getOwners(){
    $('select').empty();
    $.ajax({
         type:'GET',
        url:'/owner',
        success: function(owners){
    owners.forEach(function(owner){

        console.log(owner);
        var fullName = (owner.first_name + ' ' +owner.last_name);
        $('select').append('<option value="'+owner.id+'">'+fullName+'</option>');

    });
}
});
}


function registerOwner(event){
    event.preventDefault();

        var ownerData= $(this).serialize();
        $.ajax({
            type:'POST',
            url:'/owner',
            data:ownerData,
            success: getOwners

        });

        $(this).find('input').val('');


}

function displayPets(response){
console.log(response);
    $('#tableRows').find('tr').remove();

    response.forEach(function(pet){

//check duplicate before appending

          var $list = $('<tr></tr>');
        //   var $form =$('<form ></form>');
           $list.append('<td><p id="'+ pet.owner_id +'">' + pet.first_name +' '+pet.last_name+'</p></td>');
           $list.append('<td><input type="text" name="pet_name" value="' +pet.name +'"/></td>');
    //     var date=new Date(book.published);
        //    $list.append('<input type="date" name="published" value="'+date.toISOString().slice(0,10)+'"/>');
        $list.append('<td><input type="text" name="pet_breed" value="' +pet.breed +'"/></td>');
        $list.append('<td><input type="text" name="pet_color" value="' +pet.color +'"/></td>');
    //     //make buttons and store the id data on it
        $list.append('<td><button class="save" data-id="'+ pet.id + '">Save!</button></td>');
        $list.append('<td><button class="delete" data-id="' + pet.id +'">DELETE!</button></td>');
        $list.append('<td><button class="checkIn" data-id="' + pet.id +'" value="check">IN</button></td>');

    //     $li.append($form);
  $('#visits').append($list);

     });
//
}

function registerPet(event){
    event.preventDefault();

        var petData= $(this).serialize();
        console.log(petData);

        $.ajax({
            type:'POST',
            url:'/pet',
            data:petData,
            success: getPets


        });

        $(this).find('input').val('');

}

function deleteRow(){
    var $button=$(this);


    $.ajax({
        type:'DELETE',
        url:'/pet/'+ $button.data('id'),
        success: getPets


    });

}

function updateRow(){
    var $button =$(this);


    var pet_name = $button.closest('tr').find('input[name="pet_name"]').val();
    var pet_breed = $button.closest('tr').find('input[name="pet_breed"]').val();
    var pet_color = $button.closest('tr').find('input[name="pet_color"]').val();
    var owner_id = $button.closest('tr').find('p').attr('id');
    var data = {};
    data.pet_name=pet_name;
    data.pet_breed=pet_breed;
    data.pet_color=pet_color;
    data.owner_id=owner_id;

    console.log(data);

    $.ajax({
        type:'PUT',
        url:'/pet/'+$button.data('id'),
        data:data,
        success: getPets

    });
}

function updateStatus(){

    var $button =$(this);
    var date = new Date();
    date=date.toLocaleDateString();
    var status = $(this).text();

    var pet_id= $button.closest('tr').find('.save').data('id');
    var data ={status:status, date:date, pet_id:pet_id};

    if(status=='IN'){
        updateCheckIn($button.data('id'));
        $(this).text('OUT');

    }else if (status=='OUT') {
        updateCheckOut();
        $(this).text('IN');
    }

}
//woek on this
function updateCheckIn(response){

    // var $button =$(this);
    var date = new Date();
    date=date.toLocaleDateString();
    var pet_id=response;
    //
    // var pet_id= $button.closest('tr').find('.save').data('id');
    var data ={check_in:date, pet_id:pet_id};
    //
 console.log('updateCheckIndata',data);
    //
    $.ajax({
        type:'POST',
        url:'/status/IN',
        data:data,
        success: function(){
            console.log('Pet is now checked in!');
        }

    });

}
function updateCheckOut(){
    var date = new Date();
    date=date.toLocaleDateString();
    var pet_id=response;
    //
    // var pet_id= $button.closest('tr').find('.save').data('id');
    var data ={check_in:date, pet_id:pet_id};


        console.log(data);


    // dat
    $.ajax({
        type:'PUT',
        url:'/status/'+$button.data('id'),
        data:data,
        success: getPets

    });
}
