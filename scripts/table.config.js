function getFlag(country, className = 'small-flag') {
  return `<div class="flex align-center">
    <img class="${className}" src="./images/flags/l/${this.countryCodes.get(
    country
  )}.svg" /> ${country}
  </div>`
}

function mainHeaderTemplate() {
  return fakePromise(`
    <div class="h-16 flex justify-center items-center font-roboto">
      <label class="flex justify-between items-center p-2 text-black cursor-pointer">
        <span class="text-[12px] font-thin">Show values</span>
        <input 
          type="checkbox" 
          class="sr-only peer" 
          id="show_values" 
        />
        <div class="
          w-14 h-8 
          flex items-center flex-shrink-0 
          ml-2 p-1 bg-palebrown rounded-full
          after:w-6 
          after:h-6
          after:bg-white 
          after:rounded-full 
          after:shadow-md
          after:content-['']
          after:transition-all
          peer-checked:after:translate-x-full
          peer-checked:bg-orange
        "></div>
      </label>
    </div>
  `)
}

function headerTemplate() {
  const name = this.name
  const icon = this.icon

  return loadSvg(icon).then(iconStr => {
    return `<button class="header-btn flex align-center justify-center">
      <div class="w-full">
        <div class="icon p-1 pt-2">${iconStr}</div>
        <div class="label text-black px-0.5 py-2 font-light">${name}</div>
      </div>
    </button>`
  })
}

function mainCellTemplate(d) {
  const propName = this.propName
  return `<div class="bg-lightbrown w-full h-full rounded-md py-1 px-3 text-black text-[14px] flex items-center">
    <img src="./images/flags/l/${d["Country Code"]}.svg" class="mr-2 w-[20px] h-[15px]" /> 
    <div class="truncate ..."> ${d[propName]} </div>
  </div>`
}

function cellTemplate(d, i, arr, showValue) {
  const format = this.format || (m => m)
  const scale = this.colorScale
  const rank = d[this.rankProp]
  const color = scale(rank)
  const textColor = color === '#CD4A86' || color === '#0096B2' ? '#ffffff' : '#192435'
  const prefix = d[this.rankProp + '_is_equal'] ? '=' : ''

  let value = showValue ? d[this.propName] : `${prefix}${format(rank)}`

  if (this.isOverall) {
    value = format(d[this.propName])
  }

  return `<div class="color-box" style="background-color: ${color}; color: ${textColor};">
    ${value}
  </div>`
}

function sortFunc(a, b, order) {
  let orderFunc = order == 'asc' ? 'ascending' : 'descending'

  return d3[orderFunc](a[this.rankProp], b[this.rankProp])
}

const colors = [
  '#DC874B',
  'rgba(220, 135, 75, 0.5)',
  'rgba(98, 168, 198, 0.5)',
  '#62A8C6',
]

function getHeaders(data) {
  const columns = [
    {
      id: 1,
      isMainColumn: true,
      name: '',
      propName: 'Island',
      rankProp: 'Island',
      description: '',
      icon: '',
      class: '',
      cellTemplate: mainCellTemplate,
      headerTemplate: mainHeaderTemplate,
    },
    {
      id: 2,
      isOverall: true,
      name: 'Overall',
      propName: 'Overall Rank',
      rankProp: 'Overall Rank',
      description: '',
      order: 'asc',
      icon: './images/overall.svg',
      class: '',
      infoOrder: 6,
      cellTemplate,
      format: ordinal_suffix_of,
      sort: sortFunc,
      headerTemplate,
    },
    {
      id: 3,
      name: 'Air Quality',
      propName: 'Air Quality',
      rankProp: 'Air Quality Rank',
      description: '',
      icon: './images/airQuality.svg',
      class: '',
      infoOrder: 1,
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 4,
      name: 'Gyms & Fitness Clubs',
      propName: 'Total Number of Gyms',
      rankProp: 'Health Clubs and Gyms Rank',
      description: '',
      icon: './images/gym.svg',
      infoOrder: 2,
      class: '',
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 5,
      name: 'Yoga & Pilates Classes',
      propName: 'Total Number of Yoga & Pilates ',
      rankProp: 'Yoga & Pilates Rank',
      icon: './images/yoga.svg',
      description: '',
      infoOrder: 3,
      class: '',
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 6,
      name: 'Wellness Retreats',
      propName: 'Total Number of Wellness Retreats',
      rankProp: 'Wellness Retreats Rank',
      description: '',
      icon: './images/retreats.svg',
      infoOrder: 4,
      class: '',
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 7,
      name: 'Veggie & Vegan restaurants',
      propName: 'Total Number of Restaurants with Vegan and Vegetarian Options ',
      rankProp: 'Resaurants with Vegan and Veggie Options Rank',
      description: '',
      icon: './images/vegan.svg',
      infoOrder: 5,
      class: '',
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 8,
      name: 'Hiking Trails',
      propName: 'Total Number of Hiking Trails',
      rankProp: 'Hiking Trails Rank',
      description: '',
      icon: './images/hiking.svg',
      infoOrder: 5,
      class: '',
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
    {
      id: 9,
      name: 'Spas',
      propName: 'Total Number of Spas',
      rankProp: 'Spas Rank',
      description: '',
      icon: './images/spas.svg',
      infoOrder: 5,
      class: '',
      format: ordinal_suffix_of,
      sort: sortFunc,
      cellTemplate,
      headerTemplate,
    },
  ]

  return columns.map((d, i) => {
    const col = {
      ...d,
      id: i + 1,
    }

    if (!d.isMainColumn) {
      const extent = d3.extent(data, x => x[d.rankProp])
      col.colorScale = d3.scaleQuantile(extent, colors)

      data.forEach(datum => {
        datum[d.rankProp + '_is_equal'] = data.filter(x => x[d.rankProp] === datum[d.rankProp]).length > 1
      })
    }

    return col
  })
}