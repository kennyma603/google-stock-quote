$(document).ready(function(){
    var test = googleStockQuote.init(
        {
        'MUTF_CA:TDB900' : 'TD Canadian Index - e',
        'MUTF_CA:TDB909' : 'TD Canadian Bond Index - e',
        'MUTF_CA:TDB902' : 'TD US Index - e',
        'MUTF_CA:TDB911' : 'TD International Index - e',
        'MUTF_CA:CIB830' : 'CIBC Managed Income',
        'MUTF_CA:CIB512' : 'CIBC Monthly Income',
        'MUTF_CA:TDB908' : 'TD Nasdaq Index - e',
        'MUTF_CA:TDB907' : 'TD Japanese Index - e',
        'MUTF_CA:TDB851' : 'TD Managed Index Income (Moderate) - e'
        },
        '#quotesWrapper'
        );
})


var googleStockQuote = (function(){
    var self = {};
    var _symbolsList = {};
    var _symbolArray = [];
    var _titleArray = [];
    var _queryURL;
    var _divID;

    self.init = function(symbolsList, divID){
        _symbolsList = symbolsList;
        _divID = divID;

        populateSymbolTitleArrays(); //populate _symbolArray and _symbolArray
        _queryURL = 'http://finance.google.com/finance/info?client=ig&q=' 
                    + encodeURIComponent(_symbolArray.join(','));

        self.getQuote();
    };

    var populateSymbolTitleArrays = function(){
        $.each(_symbolsList, function(key, value){
            _symbolArray.push(key);
            _titleArray.push(value);
        });
    };

    self.getQuote = function(){
        $.ajax({
            url: _queryURL, 
            success: function(data){
                renderQuotes(eval(data));
            },
            error: function(){ alert('error'); },
            dataType: 'jsonp'
        });
    };

    var renderQuotes = function(data){

        var $quotesDIV = $(_divID);

        for(var i=0; i<data.length; i++){
            var symbol = data[i].t;
            var lastTradeTime = data[i].lt;
            var change = data[i].c;
            var changePercentage = data[i].cp;
            var l_cur = data[i].l_cur;
            var $quote = $("<div class='quote quote-" +i+ " "+ symbol +"'></div>");

            $quote.append("<div class='name'>"+ _titleArray[i] +"</div>");
            $quote.append("<div class='symbol'>"+ symbol +"</div>");
            $quote.append("<div class='price'>"+ l_cur +"</div>");
            $quote.append("<div class='change'>"+ change +"</div>");
            $quote.append("<div class='changePercentage'><span>"+ changePercentage +"%</span></div>");
            $quote.append("<div class='lastTradeTime'>"+ lastTradeTime +"</div>");

            if(parseFloat(changePercentage) > 0)
                $quote.addClass("up");
            else if (parseFloat(changePercentage) < 0)
                $quote.addClass("down");
                

            $quotesDIV.append($quote);
           
        }
    };

    return self;
}());

