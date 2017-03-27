/*
要求二1.双击事件打开文件
	2.根据pId找到谁是谁的子数据
	var arr=[];
	3.面包屑导航
	#文件夹1/文件夹1-1/文件夹1-1-1
	var data=[
			{
			id:1,
			name:文件夹1,
			pId:0
			},
			{
			id:2;
			name:文件夹2,
			pId:0
			},
			{
			id:3;
			name:文件夹1-1,//文件夹1的子文件夹的数据
			pId:1
			}
	];

*/
/*
	1删除选中的文件夹
*/
/*
分析：1.根据hash拿数据
		根据每一条数据生成一个文件夹
		给新建和确定，删除添加自定义开关状态

	  2.a1：新建，生成一条数据
			判断数据库中是否已有新建文件件
			如果有新建文件夹，就命名为新建文件夹m++
			这条数据渲染页面
		a2:确定：判断value值是否存在数据库中和是否存在同名的数据；
			存在，弹出提示框提示
			不存在：
				新的数据添加到数据库中
		a3.取消：直接删除从页面删除元素
	3.删除 
		b1判断选中文件夹的个
		b2.当选中一个时删除文件；
		并删除文件夹对应的数据
*/

var Data=[{id:1,name:"文件夹1",pId:0},{id:2,name:"文件夹2",pId:0},{id:3,name:"文件夹3",pId:0},
{id:4,name:'文件夹1-1',pId:1},{id:5,name:'文件夹2-1',pId:2},{id:6,name:'文件夹3-1',pId:3},
{id:7,name:'文件夹1-2',pId:1},{id:8,name:'文件夹1-1-1',pId:4}
];

var content=document.getElementsByClassName('content')[0];
var em=content.getElementsByTagName('em')[0];
var menu=document.getElementsByClassName('menu')[0];
var lis=menu.getElementsByTagName('li');
var num=Data.length;
var down=content.getElementsByClassName('down')[0];
var contain=content.getElementsByClassName('contain')[0];
var checks=contain.getElementsByTagName('span');
var strong=down.getElementsByTagName('strong')[0];
var checkAll=document.getElementById('all');
var oAs=strong.getElementsByTagName('a');
var RMenu=document.getElementById('right_menu')
var lis2=RMenu.getElementsByTagName('li');
var divs=contain.getElementsByTagName('div');
var shadow=document.getElementById('shadow');
var clone=document.getElementById('clone');
var pos={}//用来记录鼠标按下的位置
var isRect=false;
var isDrag=false;

//对应刚开始加载让input隐藏
var onOff=true;
window.onload=window.onhashchange=function(){
	 for(var i=0;i<lis.length;i++){
		//每个按钮添加个自定义开关，确定其状态
			lis[i].targ=false;
			lis2[i].targ=false;
		
		}
		//找到所第一级元素对应的数据
		var s=location.hash.split('=')[1];
		if(!s){
			s=0;
		}
		var data=Data.filter(function(a){
			return a.pId==s;
		});
		//渲染页面
		em.innerHTML=data.length;
		oAs[0].index=0;
		contain.innerHTML='';
		for(var i=0;i<data.length;i++){
			show(data[i]);
		}
}	
	//每一条数据对应生成一个文件夹
	 function show(d){
		var doc=document.createElement('li');
		var div=document.createElement('div');
		var span=document.createElement('span');
		var h3=document.createElement('h3');
		var p=document.createElement('p');
		var input=document.createElement('input');
		var sure=document.createElement('em');
		var cancel=document.createElement('em');
		
		
		input.type='text';
		sure.id='sure';
		cancel.id="cancel";

		doc.num=d.id;
		h3.innerHTML=d.name;
		doc.className='doc';
		doc.appendChild(div);
		doc.appendChild(h3);
		div.appendChild(span);
		doc.appendChild(p);	
		p.appendChild(input);
		p.appendChild(sure);
		p.appendChild(cancel);
		input.value=d.name;
		contain.appendChild(doc);
		if(!onOff){
			p.style.display='block';
			h3.style.display='none';
		}


		//确定函数
		function fnSure(){
				var val=input.value;
				if(!val){
					alert('命名不能为空');
					return;
				}
				for(var i=0;i<Data.length;i++){
					if(Data[i].name==val){
						alert("文件夹不能重名");
						return;
					}
				}
				h3.innerHTML=val;
				d.name=val;
				h3.style.display='block';

				p.style.display='';		
				if(lis[0].targ){
					console.log(Data);
					Data.push(d);
					onOff=true;
					fnAll();
					lis[0].targ=false;
				}
				
		}
		
		//取消函数
		function fnCancel(){
			if(lis[0].targ){
				contain.removeChild(doc);
				num--;
				onOff=false;
				for(var j=0;j<Data.length;j++){
					if(Data[j].id==doc.num){
						Data.splice(j,1);
					}

				}
				lis[0].targ=false;
			}
			if(lis[2].targ){
				h3.style.display='block';
				p.style.display='none';
				lis[2].targ=false;
			}
			if(lis2[2].targ){
				h3.style.display='block';
				p.style.display='none';
				lis2[2].targ=false;
			}
			
		}
		//双击函数
		function fnDoubble(ev){
			RMenu.style.display='none';
			var oA=document.createElement('a');
			oA.href='javascript:;';
			oA.index=d.id;
			oA.innerHTML+='/'+d.name;
			strong.appendChild(oA);
			checkAll.checked=false;
			location.hash='#path='+d.id;
			//返回上一级
			for(var i=0;i<oAs.length;i++){
				oAs[i].onclick=function(){
					location.hash='#path='+this.index;
					for(var i=oAs.length-1;i>this.index;i--){
						strong.removeChild(oAs[i]);
					}
				}
			}
		}

		//移入函数
		function fnMove(){
			this.className='hover';
			span.style.display='inline';
		}

		//移出函数
		function fnOut(){
			if(!span.className){
				this.className='';
				span.style.display='';
			}
		}
		//选中函数
		function fnCheck(ev){
			ev.cancelBubble=true;
			if(this.className){
				this.className='';
				this.parentNode.isCheck=false;
			}else{
				this.className='check';
				this.parentNode.isCheck=true;
			}
			fnAll();
		}
		
		//确定
		sure.onclick=fnSure;

		//取消
		cancel.onclick=fnCancel

		//移入
		div.onmouseover=fnMove;
		//移出
		div.onmouseout=fnOut;
			
		//模仿选中效果
		span.addEventListener('click',fnCheck);

		//文档双点击
		doc.ondblclick=fnDoubble;
	 }
	
	
	//新建
	lis[0].onclick=fnCreate;
	
	//重名名
	lis[2].onclick=fnRenname;
	lis2[2].onclick=fnRenname;

	//删除
	lis[1].onclick=fnRemove;
	lis2[1].onclick=fnRemove;
	//全选
	checkAll.onclick=fnCheckAll;
	//全选
	function fnCheckAll(){
		for(var i=0;i<checks.length;i++){
			if(this.checked){                        
				checks[i].className='check';
				checks[i].parentNode.className='hover';
				checks[i].style.display='inline';
			}else{
				checks[i].className='';
				checks[i].parentNode.className='';
				checks[i].style.display='none';
			}
		}
	}
	//判定全选函数
	function fnAll(){
		var n=0;
		for(var i=0;i<checks.length;i++){
			if(checks[i].className=='check'){
				n++;
			}
		};
		if(n!==0&&n==checks.length){
			checkAll.checked=true;
		}else{
			checkAll.checked=false;
		}
	}
	//新建
	function fnCreate(){
		RMenu.style.display='none';
		var s=location.hash.split('=')[1]
			if(!this.targ){	//当不存在targ让新建
			this.targ=true;
			onOff=false;
			var o={};
			var n=0;
			num++;
			o.id=num;
			o.name='新建文件夹';
			o.pId=s;
			
			for(var i=0;i<Data.length;i++){
				if(Data[i].name.indexOf('新建文件夹')!==-1){
					n++;
					o.name='新建文件夹'+n;
				}
			}
			show(o);
		}
	}
	
	

	//重命名
	function  fnRenname(){
		RMenu.style.display='none';
		var m=0;
		this.targ=true;
		for(var i=0;i<checks.length;i++){
			if(checks[i].className){
				m++;
			}
		}
		if(m==1){
			for(var i=0;i<checks.length;i++){
				if(checks[i].className){
					var doc=checks[i].parentNode.parentNode;
					doc.children[1].style.display='none';
					doc.children[2].style.display='block';
					checks[i].className='';
					
				}
			}
		}
	}

	
	//删除	
	function fnRemove(){
		RMenu.style.display='none';
		for(var i=0;i<checks.length;i++){
			if(checks[i].className){
				var doc=checks[i].parentNode.parentNode;
				//删除对应的结构
				contain.removeChild(doc);

				//删除对应的数据
				for(var j=0;j<Data.length;j++){
					if(Data[j].id==doc.num){
						Data.splice(j,1);
					}
					if(Data[j].pId==doc.num){
						Data.splice(j,1);
					}
				}
				i--;
			}
		}
		fnAll();	
	}
	