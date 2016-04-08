var season_now = null;

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
				}
			});

			resizeWindow();
		}
	});

	$(window).resize(function(){
    	resizeWindow();
	});
});
