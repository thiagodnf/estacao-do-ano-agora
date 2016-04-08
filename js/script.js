var season_now = null;

var next_seasons = [];

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function resizeWindow(){

	moment.locale("pt-br");

	date = moment(season_now.start_date);

	$("#seasons_name").text(season_now.season_name.toUpperCase())
	$("#start_date").text(date.format('LLLL'))
	$("#diff_date").text(date.fromNow())

	$("#content").removeClass("hide").fadeIn()

	var height = $(window).height();
	var height_content = $("#center").height();

	$("#content").css("margin-top",((height/2-height_content/2))+"px");
	$("#loading").hide();

	if(season_now.season_name == "Outono"){
		$("body").addClass("img-season-fall");
	}else if(season_now.season_name == "Inverno"){
		$("body").addClass("img-season-winter");
	}else if(season_now.season_name == "Primavera"){
		$("body").addClass("img-season-spring");
	}else if(season_now.season_name == "Verão"){
		$("body").addClass("img-season-summer");
	}
}

$(function(){

	$("#content").hide();

	$.ajax({
		url: "data/seasons.json",
		cache: true,
		success: function( data ) {
			var items = [];

			var min_diff = null;

			var date = Date.today();

			$.each( data, function( key, val ) {
				var diff = date - Date.parse(val.start_date)

				if(min_diff == null){
					min_diff = diff;
				}

				// The date already is old
				if(diff >= 0){
					 // Save the less difference, that is, the last valid date
					if(diff < min_diff){
						min_diff = diff;
						season_now = val;
					}
				}else{
					next_seasons.push(val);
				}
			});

			// Order the seasons by date
			next_seasons.sort(function(a, b) {
                return Date.parse(a.start_date) - Date.parse(b.start_date);
			});
            
			moment.locale("pt-br");

			var str = "";

			for(var i = 0; i < 4; i++){
				var date = moment(next_seasons[i].start_date);

				str += "<div class='row'>";

				if(next_seasons[i].season_name == "Outono"){
					str +="<div class='col-xs-2 nopadding'><img class='img-responsive' src='img/f_fall.png'></div>"
				}else if(next_seasons[i].season_name == "Verão"){
					str +="<div class='col-xs-2 nopadding'><img class='img-responsive' src='img/f_summer.png'></div>"
				}else if(next_seasons[i].season_name == "Primavera"){
					str +="<div class='col-xs-2 nopadding'><img class='img-responsive' src='img/f_spring.png'></div>"
				}else if(next_seasons[i].season_name == "Inverno"){
					str +="<div class='col-xs-2 nopadding'><img class='img-responsive' src='img/f_winter.png'></div>"
				}

				str +="<div class='col-xs-10 nopadding'>";
				str +="<p class='bold'>"+next_seasons[i].season_name+"</p>";
				str +="<p>Começa "+date.fromNow()+" na "+date.format('LLLL')+"</p>";
				str +="</div>";
				str +="</div><br>";
			}

			$("#the-next-seasons").append(str);




			// $.each( next_seasons, function( key, val ) {
			// 	$("#the-next-seasons").append("<li>Em "+moment(val.start_date).fromNow()+" começa o "+val.season_name+"</li>")
			// });

			resizeWindow();
		}
	});

	$('#modal-see-more').on('show.bs.modal', function () {
		$('.modal .modal-body').css('overflow-y', 'auto');
    	$('.modal .modal-body').css('max-height', $(window).height() * 0.6);
	});

	$("#btn-see-more").click(function(){
		$("#modal-see-more").modal('show');
	});

	$(window).resize(function(){
    	resizeWindow();
	});
});
