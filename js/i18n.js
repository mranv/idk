(function() {
  var i18n = {
    defaultLang: 'zh-CN',
    currentLang: null,
    translations: {},
    
    init: function() {
      this.currentLang = this.getStoredLang() || this.defaultLang;
      this.loadTranslations(this.currentLang);
    },
    
    getStoredLang: function() {
      return localStorage.getItem('selectedLanguage');
    },
    
    setLang: function(lang) {
      this.currentLang = lang;
      localStorage.setItem('selectedLanguage', lang);
      this.loadTranslations(lang);
    },
    
    loadTranslations: function(lang) {
      var self = this;
      var script = document.createElement('script');
      script.src = '/translations/' + lang + '.json';
      script.type = 'application/json';
      script.id = 'translation-data';
      
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/translations/' + lang + '.json', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          self.translations = JSON.parse(xhr.responseText);
          self.updatePage();
          self.updateLanguageSwitcher();
        }
      };
      xhr.send();
    },
    
    get: function(key) {
      var keys = key.split('.');
      var value = this.translations;
      
      for (var i = 0; i < keys.length; i++) {
        if (value[keys[i]]) {
          value = value[keys[i]];
        } else {
          return key;
        }
      }
      
      return value;
    },
    
    updatePage: function() {
      var self = this;
      
      // Update all elements with data-i18n attribute
      var elements = document.querySelectorAll('[data-i18n]');
      elements.forEach(function(element) {
        var key = element.getAttribute('data-i18n');
        element.textContent = self.get(key);
      });
      
      // Update all elements with data-i18n-placeholder attribute
      var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
      placeholders.forEach(function(element) {
        var key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = self.get(key);
      });
      
      // Update page title
      if (document.title.indexOf(' - ') > -1) {
        var titleParts = document.title.split(' - ');
        document.title = titleParts[0] + ' - ' + self.get('site.title');
      } else {
        document.title = self.get('site.title');
      }
      
      // Update HTML lang attribute
      document.documentElement.lang = this.currentLang;
      
      // Update dates
      this.updateDates();
    },
    
    updateDates: function() {
      var self = this;
      var dateElements = document.querySelectorAll('[data-date]');
      
      dateElements.forEach(function(element) {
        var dateStr = element.getAttribute('data-date');
        if (dateStr) {
          var date = new Date(dateStr);
          var formatted = self.formatDate(date);
          element.textContent = formatted;
        }
      });
    },
    
    formatDate: function(date) {
      var months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      
      var year = date.getFullYear();
      var month = this.get('months.' + months[date.getMonth()]);
      var day = date.getDate();
      
      if (this.currentLang === 'zh-CN') {
        return year + ' ' + this.get('dateFormat.year') + ' ' + 
               (date.getMonth() + 1).toString().padStart(2, '0') + ' ' + 
               this.get('dateFormat.month');
      } else if (this.currentLang === 'bn' || this.currentLang === 'hi') {
        return day + ' ' + month + ' ' + year;
      } else {
        return month + ' ' + day + ', ' + year;
      }
    },
    
    createLanguageSwitcher: function() {
      var self = this;
      var languages = [
        { code: 'zh-CN', name: '中文' },
        { code: 'en', name: 'English' },
        { code: 'bn', name: 'বাংলা' },
        { code: 'hi', name: 'हिन्दी' }
      ];
      
      var switcher = document.createElement('div');
      switcher.className = 'language-switcher';
      switcher.innerHTML = '<span class="lang-icon">🌐</span><select id="language-select"></select>';
      
      var select = switcher.querySelector('#language-select');
      
      languages.forEach(function(lang) {
        var option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        if (lang.code === self.currentLang) {
          option.selected = true;
        }
        select.appendChild(option);
      });
      
      select.addEventListener('change', function(e) {
        self.setLang(e.target.value);
      });
      
      // Insert the switcher in the header
      var header = document.querySelector('header nav') || document.querySelector('header');
      if (header) {
        header.appendChild(switcher);
      }
      
      return switcher;
    },
    
    updateLanguageSwitcher: function() {
      var select = document.getElementById('language-select');
      if (select) {
        select.value = this.currentLang;
      }
    }
  };
  
  // Initialize i18n when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      i18n.init();
      i18n.createLanguageSwitcher();
    });
  } else {
    i18n.init();
    i18n.createLanguageSwitcher();
  }
  
  // Expose i18n to global scope for debugging
  window.i18n = i18n;
})();