(function() {
  M.Util = {
    generateUUID: function() {
      var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
      var tmp = "";
      var l = 40;
      for (var i = 0; i < l; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
      }
      return tmp;
    }
  };
})();
