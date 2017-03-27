
/*
	要求：画框和拖拽
	分析：
	
	1.鼠标按下
		判定事件源是否是contain  记录鼠标坐标
		不是可以画框
		是判定是否选中记录选中元素的坐标和选中的元素，可以拖拽
	2.鼠标移动
		判定画框和拖拽
		画框时检测碰撞，确定是否被选中
		拖拽阴影框
	3.鼠标抬起
		清除画框
		清除拖拽，清除选中的元素，改变选中的元素对应的pId
*/
window.addEventListener('load',function(){
	
	for(var i=0;i<divs.length;i++){
		divs[i].isCheck=false;
	}
	var num=null;
	contain.oncontextmenu=function(ev){
		if(ev.target.parentNode.parentNode==contain){
			var l=ev.clientX;
			var t=ev.clientY;
			for(var i=0;i<checks.length;i++){
				checks[i].className='';
				divs[i].className='';

			}
			ev.target.children[0].className='check';
			ev.target.className='hover';
				
			RMenu.style.left=l+'px';
			RMenu.style.top=t+'px';
			RMenu.style.display='block';
				
		}
		return false;
	}
	contain.onclick=function(){
		RMenu.style.display='';
	}
	contain.onmousedown=function(ev){
		if(ev.target==contain){
			pos.x=ev.clientX;
			pos.y=ev.clientY;
			isRect=true;
		}else{
			if(ev.target.isCheck){
				isDrag=true;
			}
		}
		if(isDrag||isRect){
			return false;
		}	
	}
	document.onmousemove=function(ev){
		if(isRect){
			var l=ev.clientX;
			var t=ev.clientY;
			var w=Math.abs(pos.x-l);
			var h=Math.abs(pos.y-t);
			var iL=l>pos.x?pos.x:l;
			var iT=t>pos.y?pos.y:t;
			shadow.style.left=iL+'px';
			shadow.style.top=iT+'px';
			shadow.style.width=w+'px';
			shadow.style.height=h+'px';
			shadow.style.display='block';
			for(var i=0;i<divs.length;i++){
				if(duang(divs[i],shadow)){
					divs[i].className='hover';
					divs[i].children[0].className='check';
					divs[i].children[0].style.display='block'
					divs[i].isCheck=true;
					
				}else{
					divs[i].className='';
					divs[i].children[0].className='';
					divs[i].children[0].style.display='';
					divs[i].isCheck=false;
				}
			}
			fnAll();
		}
		if(isDrag){
			var n=0;
			var l=ev.clientX-clone.offsetWidth/2;
			var t=ev.clientY-clone.offsetHeight/2;
			 clone.style.display='block';
			 clone.style.left=l+'px';
			 clone.style.top=t+'px';
			for(var i=0;i<divs.length;i++){
				if(divs[i].isCheck){
					n++
				}
			}
			clone.innerHTML=n;
			for(var i=0;i<divs.length;i++){
				if(divs[i].isCheck){
					continue;
				}
				if(duang2(clone,divs[i])){
					num=divs[i].parentNode.num-1;
					console.log(num);
					return;
				}
			}
			num=null;
		}
		
	}
	document.onmouseup=function(){
		if(isRect){
			isRect=false;
			shadow.style.cssText='';
		}
		if(isDrag){
			isDrag=false; 
			clone.style.cssText='';
			if(num!==null){
				for(var i=0;i<divs.length;i++){
					if(divs[i].isCheck){
						Data[divs[i].parentNode.num-1].pId=Data[num].id;
						contain.removeChild(divs[i].parentNode);
						i--;
					}
				}
			}		
		}
	}
	
	//检测碰撞函数
	function duang(obj1,obj2){
		var pos1 = obj1.getBoundingClientRect();
		var pos2 = obj2.getBoundingClientRect();
		if(pos1.right<pos2.left || pos1.bottom<pos2.top || pos1.left>pos2.right || pos1.top>pos2.bottom){
			//没碰上
			return false;
		}else{
			//碰上
			return true;
		}
	}
	//检测碰撞函数2
	function duang2(obj1,obj2){
		var pos1 = obj1.getBoundingClientRect();
		var pos2 = obj2.getBoundingClientRect();
		if(pos1.right<pos2.left+15 || pos1.bottom<pos2.top+15 || pos1.left>pos2.right-15 || pos1.top>pos2.bottom-15){
			//没碰上
			return false;
		}else{
			//碰上
			return true;
		}
	}
})
