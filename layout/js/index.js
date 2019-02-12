window.onload = function () {

  var arrayOfWorkers = [];
  var arrSalary = [];
  var numOfIndustry;
  var indOfWorkerChanged;
  var jsonStringOfArray = '';

  var defaultArrayOfForm = ['Иван','Петров','Иванович',30,14,1500,'ООО Интеграл','ЗавЦеха'];

  drawDefaultForm();

  // ADD PERSON
  document.getElementById('addPerson').onclick = function () {
    document.getElementById('myForm').style.display='block'
    document.getElementById('addPerson').style.display='none'
    document.getElementById('table').style.display='none'
    document.getElementById('button-submit').style.display='block'
  }

  // Выбор определенного типа организации
  $('#myForm input').on('change', function() {
    if($('input[name=radioName]:checked', '#myForm').val() === '1'){
      numOfIndustry = 1;
      document.getElementById("name-org").innerHTML='Название индустриальной организации';
    }
    else{
      numOfIndustry = 2;
      document.getElementById("name-org").innerHTML='Название транспортной организации';
    }
  });

  // SUBMIT FORM
  $('#myForm').submit(function(event){

    if(this.checkValidity())
    {
      //скрываем/показываем нужные элементы
      document.getElementById('addPerson').style.display='block'
      document.getElementById('table').style.display='table'
      document.getElementById('myForm').style.display='none'

      var masOfParametrs = [];
      var typeOrganization = "";

      var name = document.getElementsByTagName("input")[0].value;
      var surname = document.getElementsByTagName("input")[1].value;
      var patronymic = document.getElementsByTagName("input")[2].value;
      var age = document.getElementsByTagName("input")[3].value;
      var experience = document.getElementsByTagName("input")[4].value;
      var salary = document.getElementsByTagName("input")[5].value;
      var organization = document.getElementsByTagName("input")[8].value;
      var position = document.getElementsByTagName("input")[9].value;

      if(numOfIndustry == 1){
        typeOrganization = "Индустриальная";
      }
      else{
        typeOrganization = "Транспортная";
      }

      // если отображается кнопка редактирования = > нужно не создавать новый объект, а применить set-теры
      if(document.getElementById('button-edit').style.display == 'block') {

        document.getElementById('button-edit').style.display='none'

        // обновляем поля в объекте
        arrayOfWorkers[indOfWorkerChanged].setParameters(organization, position);
        arrayOfWorkers[indOfWorkerChanged].setWorkerParameters(name, surname, patronymic, age, experience, salary);

        masOfParametrs.push(name, surname, age, position, typeOrganization, organization);

        updateTable(masOfParametrs, indOfWorkerChanged + 1);
      }
      // иначе - создаем новый объект(то есть была нажата кнопка добавления)
      else{
        // создаем объект рабочего
        var workerOfTransportCompany = new TransportWorker(name, surname, patronymic, age, experience, salary, organization, position);
        arrayOfWorkers.push(workerOfTransportCompany);
        masOfParametrs.push(name, surname, age, position, typeOrganization, organization);
        // передаем и массив элементов и кол-во объектов(то есть номер ID кнопки)
        drawTable(masOfParametrs, arrayOfWorkers.length);
        serializationJSON();
      }
    }
  });


  function updateTable(masOfParametrs, numOfRow) {
    var tr = document.getElementById('tr'+numOfRow);

    for (var i = 0; i < masOfParametrs.length; i++) {
      tr.getElementsByTagName('td').item(i).innerText = masOfParametrs[i];
    }
  }

  // отрисовка таблицы
  function drawTable(masOfParametrs, numId) {

    var table = document.getElementById('table');
    var tr = document.createElement('tr');
    tr.id = 'tr' + numId; // создаем ID-шник tr-ки (строке)

    for (var i = 0; i < masOfParametrs.length + 1; i++){
      var td = document.createElement('td') //создаем td-шку

      // если столбец последний - добавляем кнопки туда
      if(i == masOfParametrs.length){

        var btnEdit = document.createElement("BUTTON");
        var btnDel = document.createElement("BUTTON");
        var btnOut = document.createElement("BUTTON");

        btnEdit.className = 'edit';
        btnDel.className = 'delete';
        btnOut.className = 'output';

        // формируем ID-шник кнопки
        btnEdit.id = 'edit' + numId;
        btnDel.id = 'delete' + numId;
        btnOut.id = 'output' + numId;

        btnEdit.innerText = 'Редактировать';
        btnDel.innerText = 'Удалить';
        btnOut.innerText = 'Вывод';

        td.appendChild(btnEdit);
        td.appendChild(btnDel);
        td.appendChild(btnOut);

        tr.appendChild(td);
        break;
      }

      td.innerHTML = masOfParametrs[i]; // пишем в нее текст
      tr.appendChild(td);  // добавляем созданную td-шку в конец tr-ки
    }

    table.appendChild(tr);

    // Отслеживаем клик по кнопкам
    eventClickedButton();
  }


  function eventClickedButton() {

    // Редактирования строки
    $('.edit').on('click', function(event) {

      // для того, чтобы событие не вызывалось на все кнопки с данным классом
      event.stopPropagation();
      event.stopImmediatePropagation();

      // id - edit1/edit2/edit3 и тд, здесь мы берем только цифру
      var idLine = 'edit' + event.target.id[4];
      var numId = event.target.id[4] - 1;

      document.getElementById('myForm').style.display='block'
      document.getElementById('addPerson').style.display='none'

      // присваиваем значения рабочего в массивы
      arrayOfPropsWorker = arrayOfWorkers[numId].getAllPropsOfWorker();
      arrayOfProps = arrayOfWorkers[numId].getProps();

      // заполняем всплывающую форму значениями выбранного рабочего
      for(var i = 0; i < 6; i++){
        document.getElementsByTagName("input")[i].value = arrayOfPropsWorker[i];
      }
      document.getElementsByTagName("input")[8].value = arrayOfWorkers[numId].getOrganization();
      document.getElementsByTagName("input")[9].value = arrayOfWorkers[numId].getPost();

      document.getElementById('button-submit').style.display='none';
      document.getElementById('button-edit').style.display='block';

      // ставим ID которого будем менять
      indOfWorkerChanged = numId;
    });


    // Вывод подробной информации
    $('.output').on('click', function(event) {

      event.stopPropagation();
      event.stopImmediatePropagation();

      document.getElementById('table-output').style.display='table';
      document.getElementById('table').style.display='none';

      var idLine = 'output' + event.target.id[6];
      var indOfObject = event.target.id[6] - 1;

      // создаем массив из параметров рабочего для дальнейшего вывода в цикле
      var arrayOfProps = arrayOfWorkers[indOfObject].getAllPropsOfWorker();
      arrayOfProps.push(arrayOfWorkers[indOfObject].getOrganization(), arrayOfWorkers[indOfObject].getPost());

      for(var i = 1; i < 9; i++){
        document.getElementById('tr-'+i).getElementsByTagName('td').item(1).innerText = arrayOfProps[i-1];
      }

      /*
      // Можно и так
      document.getElementById('tr-'+1).getElementsByTagName('td').item(1).innerText = arrayOfWorkers[indOfObject].getName();
      document.getElementById('tr-'+2).getElementsByTagName('td').item(1).innerText = arrayOfWorkers[indOfObject].getSurname();
      document.getElementById('tr-'+3).getElementsByTagName('td').item(1).innerText = arrayOfWorkers[indOfObject].getPatronymic();
      document.getElementById('tr-'+4).getElementsByTagName('td').item(1).innerText = arrayOfWorkers[indOfObject].getAge();
      document.getElementById('tr-'+5).getElementsByTagName('td').item(1).innerText = arrayOfWorkers[indOfObject].getExperience();
      document.getElementById('tr-'+6).getElementsByTagName('td').item(1).innerText = arrayOfWorkers[indOfObject].getSalary();
      document.getElementById('tr-'+7).getElementsByTagName('td').item(1).innerText = arrayOfWorkers[indOfObject].getOrganization();
      document.getElementById('tr-'+8).getElementsByTagName('td').item(1).innerText = arrayOfWorkers[indOfObject].getPost();
      */

      // отслеживаем клик по кнопке -> Закрываем окно и выводим таблицу
      document.getElementById('button-table').onclick = function () {
        document.getElementById('table-output').style.display='none';
        document.getElementById('table').style.display='table';
      }
    });


    // Удаление рабочего(на данном этапе удаление не реализовано)
    $('.delete').on('click', function(event) {

      event.stopPropagation();
      event.stopImmediatePropagation();

      var idLine = 'delete' + event.target.id[6];

      result = confirm('Вы действительно хотите удалить данного рабочего?');
      console.log(result);

    });
  }

  function drawDefaultForm() {
    for(var i = 0; i < 6; i++){
      document.getElementsByTagName("input")[i].value = defaultArrayOfForm[i];
    }
    document.getElementsByTagName("input")[8].value = defaultArrayOfForm[6];
    document.getElementsByTagName("input")[9].value = defaultArrayOfForm[7];
  }

  function serializationJSON() {
    jsonStringOfArray = JSON.stringify(arrayOfWorkers);
    console.log(jsonStringOfArray);

    //console.log(JSON.parse(jsonStringOfArray));
  }

}










// конструкторы классов

function Worker(name, surname, patronymic, age, experience, salary){

  this._name = name;
  this._surname = surname;
  this._patronymic = patronymic;
  this._age = age;
  this._experience = experience;
  this._salary = salary;

  this.setWorkerParameters = function (name, surname, patronymic, age, experience, salary) {
    this._name = name;
    this._surname = surname;
    this._patronymic = patronymic;
    this._age = age;
    this._experience = experience;
    this._salary = salary;
  }

  this.getName = function () {
    return this._name;
  }

  this.getSurname = function () {
    return this._surname;
  }

  this.getPatronymic = function () {
    return this._patronymic;
  }

  this.getAge = function () {
    return this._age;
  }

  this.getExperience = function () {
    return this._experience;
  }

  this.getSalary = function () {
    return this._salary
  }

  this.getAllPropsOfWorker = function () {
    var arrayParams = [this._name, this._surname, this._patronymic, this._age, this._experience, this._salary];
    return arrayParams;
  }

}

function IndustryWorker(name, surname, patronymic, age, experience, salary, nameIndustryOrganization, position) {

  Worker.apply(this, arguments); // наследуем от класса Worker с доступом аргументов

  this._nameIndustryOrganization = nameIndustryOrganization;
  this._position = position;

  this.setParameters = function (name, post) {
    this._nameIndustryOrganization = name;
    this._position = post;
  }

  this.getOrganization = function () {
    return this._nameIndustryOrganization;
  }

  this.getPost = function () {
    return this._position;
  }

  this.getProps = function () {
    var array = [this._nameIndustryOrganization, this._position];
    return array;
  }

}

function TransportWorker(name, surname, patronymic, age, experience, salary, nameTransportOrganization, position) {

  Worker.apply(this, arguments); // наследуем от класса Worker с доступом аргументов

  this._nameTransportOrganization = nameTransportOrganization;
  this._position = position;

  this.setParameters = function (name, post) {
    this._nameTransportOrganization = name;
    this._position = post;
  }

  this.getOrganization = function () {
    return this._nameTransportOrganization;
  }

  this.getPost = function () {
    return this._position;
  }

  this.getProps = function () {
    var array = [this._nameTransportOrganization, this._position];
    return array;
  }
}










