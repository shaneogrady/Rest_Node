// The root URL for the RESTful services
var rootURL = "http://localhost:3000/products";

var currentproduct;

// Retrieve product list when application starts 
findAll();

// Nothing to delete in initial application state
$('#btnDelete').hide();

// Register listeners
$('#btnSearch').click(function() {
	search($('#searchKey').val());
	return false;
});

// Trigger search when pressing 'Return' on search key input field
$('#searchKey').keypress(function(e){
	if(e.which == 13) {
		search($('#searchKey').val());
		e.preventDefault();
		return false;
    }
});

$('#btnAdd').click(function() {
	newproduct();
	return false;
});

$('#btnSave').click(function() {
	if ($('#productId').val() == '')
		addproduct();
	else
		updateproduct();
	return false;
});

$('#btnDelete').click(function() {
	deleteproduct();
	return false;
});

$('#productList a').live('click', function() {
	findById($(this).data('identity'));
});

// Replace broken images with generic product bottle
$("img").error(function(){
  $(this).attr("src", "pics/generic.jpg");

});

function search(searchKey) {
	if (searchKey == 'Search') 
		findAll();
	else
		findByName(searchKey);
}

function newproduct() {
	$('#btnDelete').hide();
	currentproduct = {};
	renderDetails(currentproduct); // Display empty form
}

function findAll() {
	console.log('findAll');
	$.ajax({
		type: 'GET',
		url: rootURL,
		dataType: "json", // data type of response
		success: renderList
	});
}

function findByName(searchKey) {
	console.log('findByName: ' + searchKey);
	$.ajax({
		type: 'GET',
		url: rootURL + '/search/' + searchKey,
		dataType: "json",
		success: renderList 
	});
}

function findById(id) {
	console.log('findById: ' + id);
	$.ajax({
		type: 'GET',
		url: rootURL + '/' + id,
		dataType: "json",
		success: function(data){
			$('#btnDelete').show();
			console.log('findById success: ' + data.name);
			currentproduct = data;
			renderDetails(currentproduct);
		}
	});
}

function addproduct() {
	console.log('addproduct');
	var product = formToJSON();
	delete product._id;
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL,
		dataType: "json",
		data: JSON.stringify(product),
		success: function(data, textStatus, jqXHR){
			alert('product created successfully');
			$('#btnDelete').show();
			$('#productId').val(data._id);
			findAll();
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('addproduct error: ' + textStatus);
		}
	});
}

function updateproduct() {
	console.log('updateproduct');
	var product = formToJSON();
	delete product._id;
	$.ajax({
		type: 'PUT',
		contentType: 'application/json',
		url: rootURL + '/' + $('#productId').val(),
		dataType: "json",
		data: JSON.stringify(product),
		success: function(data, textStatus, jqXHR){
			alert('product updated successfully');
			findAll();
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('updateproduct error: ' + textStatus);
		}
	});
}

function deleteproduct() {
	console.log('deleteproduct');
	$.ajax({
		type: 'DELETE',
		url: rootURL + '/' + $('#productId').val(),
		success: function(data, textStatus, jqXHR){
			alert('product deleted successfully');
			currentproduct = {};
			renderDetails(currentproduct)
			findAll();
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('deleteproduct error');
		}
	});
}

function renderList(data) {
	// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
	var list = data == null ? [] : (data instanceof Array ? data : [data]);

	$('#productList li').remove();
	$.each(list, function(index, product) {
		$('#productList').append('<li><a href="#" data-identity="' + product._id + '">'+product.name+'</a></li>');
	});
}

function renderDetails(product) {
	$('#productId').val(product._id);
	$('#name').val(product.name);
	$('#country').val(product.country);
	$('#region').val(product.region);
	$('#year').val(product.year);
	$('#pic').attr('src', 'pics/' + product.picture);
	$('#description').val(product.description);
}

// Helper function to serialize all the form fields into a JSON string
function formToJSON() {
	return {
		"_id": $('#productId').val(), 
		"name": $('#name').val(), 
		"country": $('#country').val(),
		"region": $('#region').val(),
		"year": $('#year').val(),
		"picture": currentproduct.picture,
		"description": $('#description').val()
		};
}
