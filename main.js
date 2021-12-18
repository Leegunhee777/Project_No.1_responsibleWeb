'use strict'

//1. Make navBar
const navbar = document.querySelector('#navbar')
const navbarHeight = navbar.getBoundingClientRect().height
console.log(document)
document.addEventListener('scroll', () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add('navbar--dark')
  } else {
    navbar.classList.remove('navbar--dark')
  }
})

//2. Handle Scrolling
const navbarMenu = document.querySelector('.navbar__menu')
navbarMenu.addEventListener('click', (e) => {
  const target = e.target
  const link = target.dataset.link

  if (link == null) {
    return
  }
  navbarMenu.classList.remove('open')
  scrollIntoView(link)
})

const navbarToggleBtn = document.querySelector('.navbar__toggle-btn')
navbarToggleBtn.addEventListener('click', () => {
  //class="navbar__menu open" , class="navbar__menu"
  //를 왔다 갔다하면서 없으면 'open'클래스를 추가하고, 있으면 'open'클래스를 제거한다.
  navbarMenu.classList.toggle('open')
})

//3. Handle click on "contact me" button
const homeContactBtn = document.querySelector('.home__contact')
homeContactBtn.addEventListener('click', () => {
  scrollIntoView('#contact')
})

//스크롤내리면 HOME 섹션, 투명해지게 하기
const home = document.querySelector('.home__container')
const homeHeight = home.getBoundingClientRect().height
document.addEventListener('scroll', () => {
  home.style.opacity = 1 - window.scrollY / homeHeight
  //   window.scrollY / homeHeight : home의 요소의 높이를 분모로 높고 scrollY를 분자로놓으면
  //스크롤dl home요소에 가까워질수록 값이 1에 가까워지면서 , opacity값은 0 에 가까워짐
})

//스크롤내리면 , 스크롤Top으로 올리는 버튼 나타나게하는 기능
const arrowUp = document.querySelector('.arrow-up')
document.addEventListener('scroll', () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add('visible')
  } else {
    arrowUp.classList.remove('visible')
  }
})

arrowUp.addEventListener('click', () => {
  scrollIntoView('#home')
})

const workBtnContainer = document.querySelector('.work__categories')
const projects = document.querySelectorAll('.project')
const projectContainer = document.querySelector('.work__projects')
workBtnContainer.addEventListener('click', (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter
  if (filter == null) {
    return
  }

  //카테고리 클릭하면 className selected갈아끼우기
  const active = document.querySelector('.category__btn.selected')
  active.classList.remove('selected')
  //button 안의 span이 클릭될경우도 커버해야하므로 아래와같은 코드가 필요함
  //target에는 항상 button만 target되게 만드는것임
  const target = e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode
  target.classList.add('selected')

  projectContainer.classList.add('anim-out')
  setTimeout(() => {
    projects.forEach((project) => {
      if (filter === '*' || filter === project.dataset.type) {
        project.classList.remove('invisble')
      } else {
        project.classList.add('invisble')
      }
    })
    projectContainer.classList.remove('anim-out')
  }, 300)
})

//1.observer를 위해 모든 섹션 요소들을 가지고온다.
//2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다.
//3. 보여지는 섹션에 해당하는 메뉴 아이템을 .active를 통해 활성화시킨다.

const sectionIds = [
  '#home',
  '#about',
  '#skills',
  '#work',
  '#testimonials',
  '#contact',
]
//위의 id 값을 가지고있는 section요소들을 setions배열에 담는다.
const sections = sectionIds.map((id) => document.querySelector(id))
//속성값을 가지고도 요소를 가져올수있다.
const navItems = sectionIds.map((id) =>
  //html요소중에 속성 data-link값이 ${id} 인요소를 가져올수있음
  document.querySelector(`[data-link="${id}"]`)
)

let selectedNavIndex = 0
let selectedNavItem = navItems[0]

function selectNavItem(selected) {
  selectedNavItem.classList.remove('active')
  selectedNavItem = selected
  selectedNavItem.classList.add('active')
}

function scrollIntoView(selector) {
  const scrollToSection = document.querySelector(selector)
  scrollToSection.scrollIntoView({behavior: 'smooth', block: 'center'})
  //block end는 스크롤이 요소의 끝에 걸리게함, start는 요소의 시작부분
  //inline 은 block과 달리 수직방향을 스크롤이동이아닌, 수평 방향의 이동을 가능케함
  selectNavItem(navItems[sectionIds.indexOf(selector)])
}

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3,
}
const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    // !entry.isIntersecting 나가는 요소를 의미함
    // 여기서 주의 !entry.isIntersection을 하면, 스크롤에 의해 나가진게 아니라
    //원래 부터 화면 밖에 있었던 놈들 까지 걸리게 된다
    //나는 스크롤에 의해 나가진놈만 거르고싶다면
    //entry.intersectionRatio > 0 을 추가하면된다
    //why?? 애초에 화면밖에있는 놈들은 intersectionRatio값이 0 일테니까
    //스크롤에 의한 놈들은 entry.intersectionRatio > 0 일것이다.
    //내가 threshold를 0.3으로 했기때문에, 나가는 처리가 보다 더빨리된다.
    //고로 나감처리 즉 entry.isIntersecting 가 false이더라도
    //화면에 보이는 영역은 존재하므로 entry.intersectionRatio > 0인것이다.
    // threshold 값을 통해 요소가 entry.isIntersecting 되는 시점은 바꿀수있다
    //댜만 화면에 보여지는 영역의비율을 의미하는 entry.intersectionRatio는 바뀌지 않는다.
    //한다미로 화면에 보여지는대도 불구하고 threshold: 0.3설정을통해
    //entry.isIntersecting가 false일수 있다는말임
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      console.log(entry)
      //나가는 요소(target) id 에 접근하여, sectionIds배열중에 일치하는 인덱스를 찾아냄
      const index = sectionIds.indexOf(`#${entry.target.id}`)

      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1
      } else {
        selectedNavIndex = index - 1
      }

      //이렇게만 처리하면문제가 뭐냐면, 나가는 요소기준 나가는 방향이 위냐 아래냐에 따라 index로 추적한느방식인데,
      //이렇게 되면,
      //Home 버튼과 contact버튼은 active가안될수있음  why??
      //에를 들어 , 스크롤 최상단 최하단으로 옮겼는데도 불구하고 about Or Testimonial section이 화면에서 안나가고 남아있다면,
      // Home과 contact 버튼은 평생 active 될일 없을것임
      //그래서 그 해결책으로 스크롤이 최상단이거나 최하단일때는  Home과 Contact 버튼을 active되게 명시해주면됨
    }
  })
}
const observer = new IntersectionObserver(observerCallback, observerOptions)

sections.forEach((section) => observer.observe(section))

//scroll event와는 달리 wheel event는 사용자가!!!!!! 트랙패드나 마우스 휠을통한 움식임만 포착함
//scroll event의 경우 scrollIntoView함수에 의한 자동 스크롤변경에도 반응을하게됨
window.addEventListener('wheel', () => {
  //그래서 그 해결책으로 스크롤이 최상단이거나 최하단일때는  Home과 Contact 버튼을 active되게 명시해주면됨
  //아래코드임
  if (window.scrollY === 0) {
    selectedNavIndex = 0
  } else if (
    Math.round(window.scrollY + window.innerHeight) >=
    document.body.clientHeight
  ) {
    selectedNavIndex = navItems.length - 1
  }
  selectNavItem(navItems[selectedNavIndex])
})

console.log('3')
