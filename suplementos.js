Suplementos = new Meteor.Collection('suplementos');

if (Meteor.isClient) {
  Template.suplementos.suplementos = function(){
    return Suplementos.find({});
  }

  Template.busca.events ({
    'click button': function(event){
      Suplementos.remove({});
      Meteor.call("buscarBodyBuilding", $('#inputBusca').val());
      Meteor.call("buscarHealthDesign", $('#inputBusca').val());
      Meteor.call("buscarVitaCost", $('#inputBusca').val());      
    }
  });
}

if (Meteor.isServer) {

 Meteor.startup(function () {
    

    var require = __meteor_bootstrap__.require,
    scraper = require('scraper');
        
     var descricao = [];
     var preco = [];   
     var link = [];

     var teste = function(descricao, preco, link){
        Fiber(function() {             
          Suplementos.insert({descricao: descricao,
                                  preco: preco, link: link}, function(e,r){                               
                                    return;
                                  });
                    }).run();             
      }

      Meteor.methods({
        buscarBodyBuilding: function(texto){
          scraper('http://www.bodybuilding.com/store/catalog/search-results.jsp?q='+texto+'&pageSize=50', function(err, $) {
            if (err) {throw err}
              var i = 0;

              itens = $('.padded-content .store-layout-product-item');      
              $.each(itens, function () {          
                
                descricao[i] = $(this).find('.product-details').find('h3').text();
                link[i] = "http://www.bodybuilding.com"+$(this).find('.product-details').find('h3').find('a').attr('href');
                preco[i] = $(this).find('.product-to-cart').find('.store-layout-price').text();       
                teste(descricao[i], preco[i], link[i]);
                i++;
              });   
          });  
        },

        buscarHealthDesign: function(texto){
          scraper('http://www.healthdesigns.com/catalogsearch/result/index/?limit=100&q='+texto, function(err, $) {
            if (err) {throw err}
              var i = 0;

              itens = $('.item');                    
              $.each(itens, function () {          
                
                descricao[i] = $(this).find('.product-name').find('a').text();
                link[i] = $(this).find('.product-name').find('a').attr('href');
                preco[i] = $(this).find("[id^=product-price-]").text();       
                teste(descricao[i], preco[i], link[i]);
                i++;
              });   
          });  
        },

          buscarVitaCost: function(texto){
            scraper({
              'uri': 'http://www.vitacost.com/productResults.aspx?NttSR=1&ss=1&x=-1493&y=-95&ntk=products&Ntt='+texto,
               'headers': {
                  'User-Agent':'Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11'                
              }
            }
            ,function(err, $)
             {
              if (err) {throw err}
                var i = 0;

                itens = $('.pt9P');                    
                $.each(itens, function () {          
                  
                  descricao[i] = $(this).find(".prdTrm").text().replace('Vitacost price:','');
                  link[i] = 'http://www.vitacost.com'+$(this).find(".prdTrm").find('a').attr('href');
                  preco[i] = $(this).find('.pOurPriceM').text();       
                  teste(descricao[i], preco[i], link[i]);
                  i++;
                });   
            });  
          },

      });
  });
}



