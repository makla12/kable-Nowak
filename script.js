//Varabiles and consts
const widthInput = document.getElementById("width"),
lengthInput = document.getElementById("length"),
scaleInput = document.getElementById("scale"),
room = document.getElementById("room"),
box = document.getElementById("box"),
roomOutlets = document.getElementById("roomOutlets"),
outletEdit = document.getElementById("outletEdit"),
outletInfo = document.getElementById("outletInfo"),
savedRoomsList = document.getElementById("savedRooms"),
createRoomAlert = document.getElementById("roomCreateAlert"),
roomSaveAlert = document.getElementById("roomSaveAlert"),
roomDeleteAllAlert = document.getElementById("roomDeleteAllAlert"),
roomLoadAlert = document.getElementById("roomLoadAlert"),
roomDeleteAlert = document.getElementById("roomDeleteAlert");

let roomWidth = 1000,
roomHeight = 500,
items = [[]],
outletSelected = 0,
scale = 1;
//Room

const createRoom = () => { //Create room
    createRoomAlert.style.display='none';
    if(widthInput.value <= 0 || lengthInput.value <= 0){
        alert("Zostały wprowadzone złe dane");
        return 0;
    }
    roomWidth = widthInput.value * 100;
    roomHeight = lengthInput.value * 100;
    room.style.width = roomWidth * scale + 4 + "px";
    room.style.height = roomHeight * scale + 4 + "px";
    items = [[]];
    document.getElementById("box").style.display = "none";
    roomOutlets.innerHTML = "";
    outletEdit.style.display = "none";
    document.getElementById("outletEditInfo").style.display = "block";
    document.getElementById("deleteBtn").style.display = "none";
    document.getElementById("roomDim").innerHTML = `${roomWidth/100}m x ${roomHeight/100}m`
    document.getElementById("calculateCableOut").innerHTML = "";
};

const updateScale = (x) => {
    if(x <= 0){
        alert("Zostały wprowadzone złe dane");
        return 0;
    }
    scale = x;
    room.style.width = roomWidth * scale + 4 + "px";
    room.style.height = roomHeight * scale + 4 + "px";
    document.getElementById("scaleText").innerHTML = scale;
    switch(items[0][0]){
        case 0:
            box.style.left = items[0][1] * scale + "px";
            box.style.top = items[0][2] * scale + "px";
            break;
        case 2:
            box.style.left = items[0][1] * scale + "px";
            box.style.top = (roomHeight - items[0][2] - items[0][5]) * scale + "px";
            break;
        case 1:
            box.style.left = (roomWidth - items[0][2] - items[0][4]) * scale + "px";
            box.style.top = items[0][1] * scale + "px";
            break;
        case 3:
            box.style.left = items[0][2] * scale + "px";
            box.style.top = items[0][1] * scale + "px";
            break;
    }
    box.style.width = items[0][4] * scale + "px";
    box.style.height = items[0][5] * scale + "px";

    updateOutletVis();
}

//Outlets

const createOutlet = () => {
    items.push([]);
    roomOutlets.innerHTML += `<div onclick="selectOutlet(${items.length - 1})" id="outlet${items.length - 1}" class="outlet"></div>`;
    items[items.length - 1][0] = 0;
    items[items.length - 1][1] = 0;
    items[items.length - 1][2] = 100;
    items[items.length - 1][3] = `Gniazdko ${items.length - 1}`;
    selectOutlet(items.length - 1);
    calculateCable();
}

//Fix input
document.getElementById("outletI").addEventListener("change",e => {
    if(e.target.value == 0 || e.target.value == 2){
        document.getElementById("outletI2L").innerHTML = "Odległość od lewej ściany(m):";
    }
    else{
        document.getElementById("outletI2L").innerHTML = "Odległość od górnej ściany(m):";
    }
});

const selectOutlet = (x) => {
    outletSelected = x;
    document.getElementById("outletEditInfo").style.display = "none";
    document.getElementById("deleteBtn").style.display = "block";
    document.getElementById("outletEdit").style.display = "block";
    document.getElementById("outletEditName").innerHTML = items[outletSelected][3];
    document.getElementById("outletI").value = items[outletSelected][0];
    document.getElementById("outletI2").value = items[outletSelected][1] / 100;
    document.getElementById("outletI3").value = items[outletSelected][2] / 100;
    document.getElementById("outletI4").value = items[outletSelected][3];
    if(items[outletSelected][0] == 0 || items[outletSelected][0] == 2){
        document.getElementById("outletI2L").innerHTML = "Odległość od lewej ściany(m):";
    }
    else{
        document.getElementById("outletI2L").innerHTML = "Odległość od górnej ściany(m):";
    }
}

const updateOutletVis = () => {
    roomOutlets.innerHTML = "";
    let outlet;
    for(let i = 1; i < items.length; i++){
        roomOutlets.innerHTML += `<div onclick="selectOutlet(${i})" id="outlet${i}" class="outlet"></div>`;
        outlet = document.getElementById(`outlet${i}`);
        switch(items[i][0]){
            case 0:
                outlet.style.left = items[i][1] * scale - 10 + "px";
                outlet.style.top = "-11px";
                break;
            case 2:
                outlet.style.left = items[i][1] * scale - 10 + "px";
                outlet.style.top = roomHeight * scale - 9 + "px";
                break;
            case 1:
                outlet.style.left = roomWidth * scale - 9 + "px";
                outlet.style.top = items[i][1] * scale - 10 + "px";
                break;
            case 3:
                outlet.style.left = "-11px";
                outlet.style.top = items[i][1] * scale - 10 + "px";
                break;
        }
    }
}

const deleteOutlet = () => {
    items.splice(outletSelected,1);
    updateOutletVis();
    document.getElementById("deleteBtn").style.display = "none";
    document.getElementById("outletEdit").style.display = "none";
    document.getElementById("outletEditInfo").style.display = "block";
    calculateCable();
}

const updateOutlet = () => {
    let outlet = document.getElementById(`outlet${outletSelected}`);
    let outletWall = Number(document.getElementById(`outletI`).value);
    let outletDist = document.getElementById(`outletI2`).value * 100;
    let outletHeight = document.getElementById(`outletI3`).value * 100;
    let outletName = document.getElementById(`outletI4`).value
    //Check input
    switch(outletWall){
        case 0:
        case 2:
            if(outletDist > roomWidth || outletDist < 0 || outletHeight < 0){
                alert("Zostały wprowadzone złe dane");
                return 0;
            }
            break;
        case 1:
        case 3:
            if(outletDist > roomHeight || outletDist < 0 || outletHeight < 0){
                alert("Zostały wprowadzone złe dane");
                return 0;
            }
            break;
    }
    switch(outletWall){
        case 0:
            items[outletSelected][0] = outletWall;
            items[outletSelected][1] = outletDist;
            outlet.style.left = outletDist * scale - 10 + "px";
            outlet.style.top = "-11px";
            break;
        case 2:
            items[outletSelected][0] = outletWall;
            items[outletSelected][1] = outletDist;
            outlet.style.left = outletDist * scale - 10 + "px";
            outlet.style.top = roomHeight * scale - 9 + "px";
            break;
        case 1:
            items[outletSelected][0] = outletWall;
            items[outletSelected][1] = outletDist;
            outlet.style.left = roomWidth * scale - 9 + "px";
            outlet.style.top = outletDist * scale - 10 + "px";
            break;
        case 3:
            items[outletSelected][0] = outletWall;
            items[outletSelected][1] = outletDist;
            outlet.style.left = "-11px";
            outlet.style.top = outletDist * scale - 10 + "px";
            break;
    }
    items[outletSelected][2] = outletHeight;
    items[outletSelected][3] = outletName;
    selectOutlet(outletSelected);
    calculateCable();
}

//Box

const findWall = (x,y) => {
    let arr = [y,roomWidth-x,roomHeight-y,x];
    min = arr[0];
    minI = 0;
    for(let i = 1;i < 4;i++){
        if(arr[i] < min){
            min = arr[i];
            minI = i;
        }
    }
    return minI;
};

const createBox = () => {
    let BoxX = document.getElementById("BoxX").value * 100;
    let BoxY = document.getElementById("BoxY").value * 100;
    let BoxH = document.getElementById("BoxH").value * 100;
	let BoxW = document.getElementById("BoxWidth").value * 100;
	let BoxL = document.getElementById("BoxLength").value * 100;
    //Check inputs
    if(BoxX + BoxW > roomWidth || BoxY + BoxL > roomHeight || BoxX < 0 || BoxY < 0 || BoxH < 0 || BoxW <= 0 || BoxL <= 0) {
        alert("Zostały wprowadzone złe dane");
        return 0;
    }
    items[0][0] = findWall(BoxX,BoxY);
    switch(items[0][0]){
        case 0:
            items[0][1] = BoxX;
            items[0][2] = BoxY;
            break;
        case 1:
            items[0][1] = BoxY;
            items[0][2] = roomWidth - BoxX - BoxW;
            break;
        case 2:
            items[0][1] = BoxX;
            items[0][2] = roomHeight - BoxY - BoxL;
            break;
        case 3:
            items[0][1] = BoxY;
            items[0][2] = BoxX;
            break;
    }
    items[0][3] = BoxH;
    items[0][4] = BoxW;
    items[0][5] = BoxL;
    box.style.left = BoxX * scale + "px";
    box.style.top = BoxY * scale + "px";
    box.style.width = BoxW * scale + "px";
	box.style.height = BoxL * scale + "px";
    box.style.display = "block";
    calculateCable();
}

//Outlet info
let data, id, boxDist;
document.addEventListener("mouseover", e => {
    if(e.target.className == "outlet"){
        id = e.target.id;
        id = id.split("outlet")[1];
        data = items[id];
        switch(data[0]){
            case 0:
                outletInfo.style.left = data[1] * scale + "px";
                if(data[1] * scale + 250 > roomWidth * scale){
                    outletInfo.style.left = data[1] * scale - 250 + "px";
                }
                outletInfo.style.top = "15px";
                break;
            case 2:
                outletInfo.style.left = data[1] * scale + "px";
                if(data[1] * scale + 250 > roomWidth * scale){
                    outletInfo.style.left = data[1] * scale - 250 + "px";
                }
                outletInfo.style.top = roomHeight * scale + 15 + "px";
                break;
            case 1:
                outletInfo.style.left = roomWidth * scale - 250 + "px";
                outletInfo.style.top = data[1] * scale + 15 + "px";
                break;
            case 3:
                outletInfo.style.left = 0;
                outletInfo.style.top = data[1] * scale + 15 + "px";
                break;
        }
        document.getElementById("outletInfo1").innerHTML = data[3];
        boxDist = calculateDist(data);
        if(boxDist == -1){
            document.getElementById("outletInfo2").innerHTML = "";
        }
        else{
            document.getElementById("outletInfo2").innerHTML = boxDist / 100 + "m";
        }
        outletInfo.style.display = "block";
    }
    else{
        outletInfo.style.display = "none";
    }
});

//Cable calculation

const calculateDist = (coords) => {
    if(items[0].length == 0){
        return -1;
    }
    let boxCoords = items[0];
    let WallDif = Math.abs(coords[0] - boxCoords[0]);
    let dist;
    switch(WallDif){
        case 0: //Same wall
            dist = Math.abs(boxCoords[1] - coords[1]);
            break;
        case 1: //Adjacent wall
        case 3:
            switch(boxCoords[0]){
                case 0:
                    switch(coords[0]){
                        case 1:
                            dist = coords[1] + roomWidth - boxCoords[1];
                            break;
                        case 3:
                            dist = coords[1] + boxCoords[1];
                            break;
                    }
                    break;
                case 2:
                    switch(coords[0]){
                        case 1:
                            dist = roomHeight - coords[1] + roomWidth - boxCoords[1];
                            break;
                        case 3:
                            dist = roomHeight - coords[1] + boxCoords[1];
                            break;
                    }
                    break;
                case 1:
                    switch(coords[0]){
                        case 0:
                            dist = roomWidth - coords[1] + boxCoords[1];
                            break;
                        case 2:
                            dist = roomWidth - coords[1] + roomHeight - boxCoords[1];
                            break;
                    }
                    break;
                case 3:
                    switch(coords[0]){
                        case 0:
                            dist = coords[1] + boxCoords[1];
                            break;
                        case 2:
                            dist = coords[1] + roomHeight - boxCoords[1];
                            break;
                    }
                    break;
            }
            break;

        case 2: //Oposite wall
            dist = coords[1] + boxCoords[1] + (boxCoords[0] % 2 == 0 ? roomHeight : roomWidth);
            if(dist > roomHeight + roomWidth){
                dist = roomHeight * 2 + roomWidth * 2 - dist;
            }
            break;
    }
    return dist + boxCoords[2] + Math.abs(coords[2] - boxCoords[3]);
};

const calculateCable = () => {
    if(items[0].length == 0){
        document.getElementById("calculateCableOut").innerHTML = "";
        return 0;
    }
    let cable = 0;
    for(let i = 1;i < items.length;i++){
        cable += calculateDist(items[i]);
    }
    
    document.getElementById("calculateCableOut").innerHTML = cable/100 + "m";
};

//Saving room data

const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
const removeCookie = cname => {
    document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
const romoveAllCokies = () => {
    let cookieList = document.cookie.split(";");
    for(let i of cookieList){
        removeCookie(i.trim().split("=")[0]);
    }
    roomDeleteAllAlert.style.display='none';
    roomLoadList();
}

const saveRoom = (x) => {
    let saveData = [roomWidth,roomHeight,items[0].length != 0,items];
    setCookie(x,saveData,365);
    roomLoadList();
    roomSaveAlert.style.display='none';
}

const roomLoadList = () => {
    if(document.cookie == ''){
        savedRoomsList.innerHTML = "";
        return 0;
    }

    let cookieList = document.cookie.split(";");
    savedRoomsList.innerHTML = "";
    let roomName;
    for(let i of cookieList){
        roomName = i.trim().split("=")[0];
        savedRoomsList.innerHTML += `
        <div style="display: flex;">
            <h3 style="margin: 0 20px 0 0;">${roomName}</h3>
            <button onclick="loadRoomAlert('${roomName}')" class="btn btn-success" style="font-size: large;margin-right: 20px;">Wczytaj pokój</button>
            <button onclick="deleteRoomAlert('${roomName}')" class="btn btn-danger" style="font-size: large;">Usuń pokój</button>
        </div>`;
    }
}
const loadRoom = (roomName) => {
    let cookieList = document.cookie.split(";");
    let loadData, cookie;
    for(let i of cookieList){
        cookie = i.trim().split("=");
        if(cookie[0] == roomName){
            loadData = cookie[1];
            break; 
        }
    }
    loadData = loadData.split(",");
    roomWidth = Number(loadData.splice(0,1));
    roomHeight = Number(loadData.splice(0,1));

    items = [];
    if(loadData[0] == "true"){
        box.style.display = "block";
        loadData.splice(0,1);
        items.push(loadData.splice(0,6));
    }
    else{
        box.style.display = "none";
        items.push([]);
        loadData.splice(0,2);
    }

    while(loadData.length != 0){
        items.push(loadData.splice(0,4));
    }

    for(let i = 0; i < items[0].length;i++){
        items[0][i] = Number(items[0][i]);
    }

    for(let i = 1; i < items.length;i++){
        for(let j = 0; j < items[i].length - 1;j++){
            items[i][j] = Number(items[i][j])
        }
    }

    updateScale(1);
    calculateCable();
    roomLoadAlert.style.display = "none";
}
roomLoadList();

let roomLoadName;
const loadRoomAlert = (x) => {
    roomLoadName = x;
    roomLoadAlert.style.display = "flex";
    document.getElementById("roomLoadName").innerHTML = roomLoadName;
}
const deleteRoomAlert = (x) => {
    roomLoadName = x;
    roomDeleteAlert.style.display = "flex";
    document.getElementById("roomDeleteName").innerHTML = roomLoadName;

}