////////////////////////////////////////////////////////
//==================灯、鸟、花=========================//
////////////////////////////////////////////////////////
//灯动画 
var container=$('#content'); 
var lamp = {
    elem: $('.b_background'),
    bright: function() {
		this.elem.hide();
    },
    dark: function() {
		this.elem.show();
    }
};
//鸟动画
var bird = {
elem: $(".bird"),
    fly: function() {
        this.elem.addClass('birdFly')
        this.elem.transition({
            right: container.width()
        }, 15000, 'linear');
    }
};

function doorAction(left, right, time) {
    var $door = $('.door');
    var doorLeft = $('.door-left');
    var doorRight = $('.door-right');
    var defer = $.Deferred();
    var count = 2;
    // 等待开门完成
    var complete = function() {
        if (count == 1) {
            defer.resolve();
            return;
        }
        count--;
    };
    doorLeft.transition({
        'left': left
    }, time, complete);
    doorRight.transition({
        'left': right
    }, time, complete);
    return defer;
}
// 开门
function openDoor() {
    return doorAction('-50%', '100%', 2000);
}
// 关门
function shutDoor() {
    return doorAction('0%', '50%', 2000);
}  
////////////////////////////////////////////////////////
//==================灯、鸟、花=========================//
////////////////////////////////////////////////////////
function BoyWalk(){
	////////////////////////////////////////////////////////
	//===================页面布局==========================//
	////////////////////////////////////////////////////////
	var container=$('#content'); 
	// 页面可视区域
	var visualWidth = container.width();
	var visualHeight = container.height();	
	// 获取数据
	var getValue=function(className){
		var $ele=$(''+className+'');
		// 走路的路线坐标
		return {
			top: $ele.position().top,
			height: $ele.height()
		}
	};
	// 路的Y轴
	var pathY=function(){
		var data=getValue('.a_background_middle');
		return data.top+data.height/2;
	}(); 
	// 修正小男孩的正确位置
	var $boy = $("#boy");
    var boyHeight = $boy.height();
    $boy.css({
    	'top' : (pathY-boyHeight+25) + 'px'
    });
    ////////////////////////////////////////////////////////
	//===================动画处理==========================//
	////////////////////////////////////////////////////////
	
	// 暂停走路
    function pauseWalk() {
        $boy.addClass('pauseWalk');
    }
    // 恢复走路
    function restoreWalk() {
        $boy.removeClass('pauseWalk');
    }
    // css3的动作变化
    function slowWalk() {
        $boy.addClass('slowWalk');
    }
    
	// 计算移动距离  x y 比例
	function calculateDist(direction, proportion){ 
		return	(direction=='x'?visualWidth:visualHeight) * proportion ;
	}
	
	// 用transition做运动
	function stratRun(options, runTime){
		var dfdPlay = $.Deferred();
	    // 恢复走路
	    restoreWalk();
	    // 运动的属性
		$boy.transition(
			options,
			runTime,
			'linear',
			function(){
				dfdPlay.resolve(); // 动画完成
			}
		)
		
		return dfdPlay;
	}
	// 开始走路
	
	function walkRun(time, dist, disY) {
	    time = time || 3000;
	    // 脚动作
	    slowWalk();
	    // 开始走路
	    var d1 = stratRun({
	        'left': dist + 'px',
	        'top': disY ? disY : undefined
	    }, time);
	    return d1;
	}
	
	//var disX=calculateDist('x',0.6);
	//var disY=calculateDist('y',0.5);
	//walkRun(15000,disX,disY);
		
    // 走进商店
    var instanceX;
    function walkToShop(runTime) {
        var defer = $.Deferred();
        var doorObj = $('.door');
        // 门的坐标
        var offsetDoor = doorObj.offset();
        var doorOffsetLeft = offsetDoor.left;
        console.log(doorOffsetLeft)
        // 小孩当前的坐标
        var offsetBoy = $boy.offset();
        var boyOffetLeft = offsetBoy.left;
        console.log(boyOffetLeft)
        // 当前需要移动的坐标  小男孩到商店从门口到店里的距离
        instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffetLeft + $boy.width() / 2);
		console.log(instanceX)
        // 开始走路
        var walkPlay = stratRun({
			transform: "translateX(" + instanceX + "px),scale(0.3,0.3)",
			opacity: 0.1
		}, 2000);
        
        // 走路完毕
        walkPlay.done(function() {
            $boy.css({
                opacity: 0
            })
            defer.resolve();
        })
        return defer;
    }

    // 走出店
    function walkOutShop(runTime) {
        var defer = $.Deferred();
        restoreWalk();
        //开始走路
        var walkPlay = stratRun({
            transform: 'translateX(' + instanceX + 'px),scale(1,1)',
           opacity: 1
        }, runTime);
        //走路完毕
        walkPlay.done(function() {
            defer.resolve();
        });
        return defer;   
    }
	
	//取花		
	function talkFlower(){
		//增加延时等待效果
		var defer=$.Deferred();
		setTimeout(function(){
			$boy.addClass('slowFlolerWalk');
			defer.resolve();
		},1000)
		return defer;
	}
    return {
               // 开始走路
               walkTo: function(time, proportionX, proportionY) {
                   var distX = calculateDist('x', proportionX)
                   var distY = calculateDist('y', proportionY)
                   return walkRun(time, distX, distY);
               },
               // 走进商店
               toShop: function() {
                   return walkToShop.apply(null, arguments);
               },
               // 走出商店
               outShop: function() {
                   return walkOutShop.apply(null, arguments);
               },
               // 停止走路
               stopWalk: function() {
                   pauseWalk();
               },
               setColoer: function(value) {
                   $boy.css('background-color', value)
               },
               // 获取男孩的宽度
               getWidth: function() {
                   return $boy.width();
               },
               // 复位初始状态
               resetOriginal: function() {
                   this.stopWalk();
                   // 恢复图片
                   $boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
               },
               // 转身动作
               rotate: function(callback) {
                   restoreWalk();
                   $boy.addClass('boy-rotate');
                   // 监听转身完毕
                   if (callback) {
                       $boy.on('animationend', function() {
                           callback();
                           $(this).off();
                       })
                   }
               },
               // 取花
               talkFlower: function() {
                   $boy.addClass('slowFlolerWalk');
               }
           }
//  return {
//      // 开始走路
//      walkTo: function(time, proportionX, proportionY) {
//          var distX = calculateDist('x', proportionX)
//          var distY = calculateDist('y', proportionY)
//          return walkRun(time, distX, distY);		/* return 获取Deferred对象  执行后续then操作 */
//      },
//  	// 走进商店
//      toShop: function() {
//          return walkToShop.apply(null, arguments);
//      },
//      // 走出商店
//      outShop: function() {
//          return walkOutShop.apply(null, arguments);
//      }, 
//      // 停止走路
//      stopWalk: function() {
//          pauseWalk();
//      },
//      // 取花
//      talkFlower: function() {
//          return talkFlower();
//      },
//      // 复位初始状态
//      resetOriginal: function() {
//          this.stopWalk();
//          // 恢复图片
//          $boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
//      },
//		// 转身动作
//		
//	    rotate: function(callback) {
//		    restoreWalk();
//		    console.log($boy.attr('class'))
//		    $boy.addClass('boy-rotate');
//		    // 监听转身完毕
//		    if (callback) {
//		    	console.log(0)
//	            $boy.on('animationEnd', function() {
//	            	console.log(1)
//	                callback();
//	                console.log(2)
//	                $(this).off();
//	            })
//	        }
//	    }
//  }

}
