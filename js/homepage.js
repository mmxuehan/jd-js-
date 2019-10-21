window.onload = function(){
	//用来控制轮播区背景图的自适应代码
	window.onresize = function(){
		let jdloop = document.getElementById("jdloop");
		jdloop.style.backgroundSize = jdloop.offsetWidth+"px";
	}
	
	searchApha();
	searchFocus();
	timeBack();
	jdLoop();
}
//搜索块透明效果的代码

	function searchApha(){
		var loopWrap = document.getElementById('loopWrap')
		var jdHead = document.querySelector(".jd-head");
		//console.log(jdHead)
		var loopWrapHeight = loopWrap.offsetHeight;
		var loopLis = loopWrap.getElementsByTagName("li");
		window.onscroll = function(){
			var scollOut = document.documentElement.scrollTop||document.body.scrollTop;
			// console.log(loopWrapHeight);
			if(loopWrapHeight > scollOut){
				// console.log("aaa")
				// console.log(loopWrapHeight);
				var Atransparent=(loopWrapHeight-scollOut)/loopWrapHeight+0.1;
				console.log(Atransparent)
				jdHead.style.background = "rgba(200,37,25,"+Atransparent+")"
			}
		}
	}
	
	
	//搜索块获取焦点的时候自动实体化
	function searchFocus(){
		var headSearch = document.querySelector(".head-search");
		var searchInput = headSearch.getElementsByTagName("input")[0];
		searchInput.onfocus = function(){
			jdHead.style.background = "rgba(200,37,25,1)"
		}
	}
	
	
	//实现倒计时效果
	function timeBack(){
		var sHour = document.getElementById("s-hour");
		var sMinute = document.getElementById("s-minute");
		var sSecond = document.getElementById("s-second");
		var timeAll = 3700
		setInterval(function(){
			timeAll--;
			sHour.innerHTML = Math.floor(timeAll/3600)>=10?Math.floor(timeAll/3600):"0"+Math.floor(timeAll/3600)
			sMinute.innerHTML = Math.floor(timeAll%3600/60)>=10?Math.floor(timeAll%3600/60):"0"+Math.floor(timeAll%3600/60)
			sSecond.innerHTML = Math.floor(timeAll%60)>=10?Math.floor(timeAll%60):"0"+Math.floor(timeAll%60)
		},1000)
	}
	
	
	//实现轮播图效果
	function jdLoop(){
		//先在开头和结尾添加最后一个和第一和元素
		var loopWrap = document.getElementById('loopWrap');
		var loopLis = loopWrap.getElementsByTagName("li");
		console.log(loopLis)
		//获取首位的li和尾部的li
		var lastLi = loopLis[loopLis.length-1].cloneNode(true);
		var firstLi = loopLis[0].cloneNode(true);
		
		//往ul里面添加li
 		loopWrap.insertBefore(lastLi,loopWrap.children[0]);
		
		loopWrap.appendChild(firstLi);
		// console.log(loopWrap,lastLi,firstLi)
		var jdloop = document.getElementById("jdloop");
		//获取li的数量
		var count = loopLis.length;
		// alert(count)
		var swapWith = jdloop.offsetWidth
		var jdloopWidth = swapWith * count; 
		//设置ul的宽度
		// alert(jdloopWidth)
		// alert(jdloopWidth)
		loopWrap.style.width = jdloopWidth + "px";
		//设置ul的left为-100%
		loopWrap.style.position = "relative";
		
		loopWrap.style.left = "-100%";
		//设置li的宽度
		for(let i = 0; i < loopLis.length; i++){
			loopLis[i].style.width = swapWith + "px";
		}
		
		
		
		//自动轮播
		//获取每张图片的宽度，轮播时向左移动这个宽度
		var index = 1;
		// var wrapWidth = loopWrap.offsetWidth;
		
		var timeId;
		
		var loopInterval = function(){
			timeId = setInterval(function(){
				index++;
				loopWrap.style.transition = "all 0.7s ease-in-out";
				
				loopWrap.style.left = (-index * swapWith) + "px";
				//添加过度效果
				//判断是否到达最后一张，如果到达，让index等于1，清楚过渡效果，并让left回到index的位置
				setTimeout(function() {
					if (index == loopLis.length-1) {
						index = 1;
						//清除过度效果
						loopWrap.style.transition = "none";
						loopWrap.style.left = (-index * swapWith) + "px";
					}
				}, 700);
				
			},2000)
		} 
		loopInterval();
		//轮播操作要关注三点：1、index的值，2、left的值，3、加不加过度效果
		//手动轮播操作
		//1、touchstart事件，获取startX，start Y，
		var startX,moveX,distanceX;
		var isEnd = true;
		//手指触摸事件
		loopWrap.addEventListener("touchstart",function(e){
			startX = e.targetTouches[0].clientX;
			//取消定时器
			console.log(timeId)
			clearInterval(timeId)
		});
		//手指移动事件
		loopWrap.addEventListener("touchmove",function(e){
			if(isEnd == true){
				moveX = e.targetTouches[0].clientX;
				distanceX = moveX - startX;
				//取消过度效果
				loopWrap.style.transition = "none";
				//让ul跟随手指移动
				loopWrap.style.left = (-index * swapWith + distanceX) + "px";
			}
		})
		//手指离开事件
		loopWrap.addEventListener("touchend",function(){
			//判断手指离开时滑动的距离，决定回弹还是下一张
			isEnd = false;
			if(Math.abs(distanceX) > 100){
				if (distanceX > 0) {
					//轮播到上一张图片
					index--
				} else{
					//轮播到下一张图片
					index++
				}
				//设置left的值
				loopWrap.style.left = (-index*swapWith)+"px";
				//加过度效果
				loopWrap.style.transition = "left 0.7s ease-in-out"
				
			}else if(Math.abs(distanceX) > 0){
				//回弹操作，distanceX没有大于100
				loopWrap.style.left = (-index*swapWith)+"px";
				loopWrap.style.transition = "left 0.7s ease-in-out"
			}
			//将上一次的distanceX重置为0
			distanceX = 0;
			startX = 0;
			moveX = 0;
			
		})
		//处理手动轮播第一张图片前面空白的问题
		loopWrap.addEventListener("webkitTransitionEnd",function(){
			//如果是最后一张，后面回到第一张，
			if(index == loopLis.length - 1){
				index = 1;
				loopWrap.style.transition = "none";
				loopWrap.style.left = -index * swapWith; 
			}
			//如果是第一张，前面回到最后一张，
			else if(index == 0){
				index = loopLis.length - 2;
				loopWrap.style.transition = "none";
				loopWrap.style.left = -index * swapWith; 
			}
			setTimeout(function(){
				//重新开启定时器
				isEnd = true;
				clearInterval(timeId);
				loopInterval();
			},100)
			
		})
		
		
		
		
		
		
		
	}
	
	