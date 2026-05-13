import { Article } from '../types'

export const articles: Article[] = [
  {
    id: 1,
    title: 'Mi Familia',
    titleCN: '我的家人',
    level: 'A1',
    order: 1,
    illustration: '👨‍👩‍👧‍👦',
    content: `Mi familia es muy grande. Tengo una madre y un padre. Ellos se llaman María y Carlos.

Tengo dos hermanos y una hermana. Mi hermano mayor se llama Pedro y mi hermano menor se llama Juan. Mi hermana se llama Ana.

Nosotros vivimos en una casa grande. La casa tiene un jardín bonito.`,
    keywords: [
      { id: 1, word: 'familia', translation: '家庭, 家人', phonetic: '/faˈmi.lja/', examples: ['Mi familia es grande.', 'La familia es importante.'] },
      { id: 2, word: 'madre', translation: '母亲', phonetic: '/ˈma.ðɾe/', examples: ['Mi madre cocina muy bien.', 'La madre de María es doctora.'] },
      { id: 3, word: 'padre', translation: '父亲', phonetic: '/ˈpa.ðɾe/', examples: ['Mi padre trabaja mucho.', 'El padre de Juan es profesor.'] },
      { id: 4, word: 'hermano', translation: '兄弟', phonetic: '/eɾˈma.no/', examples: ['Tengo un hermano mayor.', 'Mi hermano estudia en la universidad.'] },
      { id: 5, word: 'hermana', translation: '姐妹', phonetic: '/eɾˈma.na/', examples: ['Mi hermana es muy simpática.', 'Tengo dos hermanas pequeñas.'] },
      { id: 6, word: 'casa', translation: '房子, 家', phonetic: '/ˈka.sa/', examples: ['Mi casa tiene tres habitaciones.', 'Vamos a casa.'] },
    ],
    phrases: [
      { phrase: 'Mi familia es...', translation: '我的家人是...', usage: '用于介绍自己的家人' },
      { phrase: 'Ellos se llaman...', translation: '他们叫...', usage: '用于介绍他人的名字' },
      { phrase: 'Nosotros vivimos en...', translation: '我们住在...', usage: '用于描述居住地点' },
    ]
  },
  {
    id: 2,
    title: 'En la Escuela',
    titleCN: '在学校',
    level: 'A1',
    order: 2,
    illustration: '🏫',
    content: `Yo voy a la escuela todos los días. La escuela está cerca de mi casa.

En la escuela hay muchos alumnos y profesores. Mi profesor de español se llama Señor Rodríguez.

Nosotros estudiamos matemáticas, ciencia, historia y español. La clase de español es mi favorita.`,
    keywords: [
      { id: 7, word: 'escuela', translation: '学校', phonetic: '/esˈkwe.la/', examples: ['La escuela está cerca.', 'Voy a la escuela en autobús.'] },
      { id: 8, word: 'profesor', translation: '老师', phonetic: '/pɾo.feˈsoɾ/', examples: ['El profesor explica bien.', 'Mi profesor es muy amable.'] },
      { id: 9, word: 'alumno', translation: '学生', phonetic: '/aˈlum.no/', examples: ['Soy un buen alumno.', 'Los alumnos estudian mucho.'] },
      { id: 10, word: 'clase', translation: '课程, 教室', phonetic: '/ˈkla.se/', examples: ['La clase empieza a las ocho.', '¿Te gusta esta clase?'] },
      { id: 11, word: 'estudiar', translation: '学习', phonetic: '/es.tuˈðjaɾ/', examples: ['Yo estudio español.', 'Necesito estudiar para el examen.'] },
    ],
    phrases: [
      { phrase: 'Yo voy a...', translation: '我去...', usage: '用于描述去某地的动作' },
      { phrase: 'En la escuela hay...', translation: '学校里有...', usage: '用于描述某处存在的事物' },
    ]
  },
  {
    id: 3,
    title: 'Los Colores',
    titleCN: '颜色',
    level: 'A1',
    order: 3,
    illustration: '🌈',
    content: `Los colores son muy importantes. El cielo es azul y el sol es amarillo.

La hierba es verde y las flores son de muchos colores: rojas, blancas y moradas.

Mi color favorito es el azul. Mi madre prefiere el rojo. Mi padre dice que el negro es elegante.`,
    keywords: [
      { id: 12, word: 'color', translation: '颜色', phonetic: '/koˈloɾ/', examples: ['¿De qué color es?', 'Me gusta el color azul.'] },
      { id: 13, word: 'azul', translation: '蓝色', phonetic: '/aˈθul/', examples: ['El cielo es azul.', 'Tengo un vestido azul.'] },
      { id: 14, word: 'rojo', translation: '红色', phonetic: '/ˈro.xo/', examples: ['La manzana es roja.', 'El rojo es mi color favorito.'] },
      { id: 15, word: 'verde', translation: '绿色', phonetic: '/ˈbeɾ.ðe/', examples: ['Las hojas son verdes.', 'Me gusta el verde.'] },
      { id: 16, word: 'amarillo', translation: '黄色', phonetic: '/a.maˈɾi.ʎo/', examples: ['El sol es amarillo.', 'Las flores son amarillas.'] },
      { id: 17, word: 'negro', translation: '黑色', phonetic: '/ˈne.ɣɾo/', examples: ['El gato es negro.', 'Uso ropa negra.'] },
      { id: 18, word: 'blanco', translation: '白色', phonetic: '/ˈblan.ko/', examples: ['La nieve es blanca.', 'La pared es blanca.'] },
    ],
    phrases: [
      { phrase: 'Mi color favorito es...', translation: '我最喜欢的颜色是...', usage: '用于表达最喜欢的颜色' },
      { phrase: '...es de muchos colores', translation: '...有很多颜色', usage: '用于描述多彩的事物' },
    ]
  },
  {
    id: 4,
    title: 'Los Números',
    titleCN: '数字',
    level: 'A1',
    order: 4,
    illustration: '🔢',
    content: `Los números son muy útiles. Uno, dos, tres, cuatro, cinco... hasta veinte.

Con los números podemos contar cosas. Tengo cinco dedos en cada mano.

Para contar más, usamos: treinta, cuarenta, cincuenta, sesenta, setenta, ochenta, noventa y cien.`,
    keywords: [
      { id: 19, word: 'uno', translation: '一', phonetic: '/ˈu.no/', examples: ['Tengo un hermano.', 'Uno más uno son dos.'] },
      { id: 20, word: 'dos', translation: '二', phonetic: '/dos/', examples: ['Dos y dos son cuatro.', 'Tengo dos libros.'] },
      { id: 21, word: 'tres', translation: '三', phonetic: '/tɾes/', examples: ['Tres y tres son seis.', 'Hay tres gatos.'] },
      { id: 22, word: 'cuatro', translation: '四', phonetic: '/ˈkwa.tɾo/', examples: ['Tengo cuatro hermanos.', 'Cuatro y cuatro son ocho.'] },
      { id: 23, word: 'cinco', translation: '五', phonetic: '/ˈθin.ko/', examples: ['Cinco dedos.', 'Son las cinco.'] },
      { id: 24, word: 'diez', translation: '十', phonetic: '/djeθ/', examples: ['Diez y diez son veinte.', 'Tengo diez euros.'] },
    ],
    phrases: [
      { phrase: '...y...son...', translation: '...和...是...', usage: '用于数学运算' },
      { phrase: 'Tengo...', translation: '我有...', usage: '用于表达数量' },
    ]
  },
  {
    id: 5,
    title: 'Mi Casa',
    titleCN: '我的家',
    level: 'A1',
    order: 5,
    illustration: '🏠',
    content: `Mi casa es grande y bonita. Tiene tres pisos.

En la planta baja está la cocina y el salón. En el primer piso están los dormitorios y el baño.

En el jardín hay flores y un árbol grande. Me gusta sentarme bajo el árbol a leer.`,
    keywords: [
      { id: 25, word: 'cocina', translation: '厨房', phonetic: '/koˈθi.na/', examples: ['La cocina está limpia.', 'Voy a cocinar.'] },
      { id: 26, word: 'dormitorio', translation: '卧室', phonetic: '/doɾ.miˈto.ɾjo/', examples: ['Mi dormitorio es grande.', 'Necesito dormir en el dormitorio.'] },
      { id: 27, word: 'baño', translation: '浴室, 厕所', phonetic: '/ˈba.ɲo/', examples: ['El baño está ocupado.', 'Voy al baño.'] },
      { id: 28, word: 'salón', translation: '客厅', phonetic: '/saˈlon/', examples: ['El salón es espacioso.', 'Vemos la televisión en el salón.'] },
      { id: 29, word: 'jardín', translation: '花园', phonetic: '/xaɾˈðin/', examples: ['El jardín tiene flores.', 'Trabajo en el jardín.'] },
      { id: 30, word: 'piso', translation: '楼层, 地板', phonetic: '/ˈpi.so/', examples: ['Vivo en el tercer piso.', 'El piso está limpio.'] },
    ],
    phrases: [
      { phrase: 'En...está...', translation: '在...有...', usage: '用于描述位置和存在的事物' },
      { phrase: 'Me gusta...', translation: '我喜欢...', usage: '用于表达喜好' },
    ]
  },
  {
    id: 6,
    title: 'La Comida',
    titleCN: '食物',
    level: 'A1',
    order: 6,
    illustration: '🍽️',
    content: `La comida es muy importante para la salud. Nosotros comemos tres comidas al día: desayuno, almuerzo y cena.

Para el desayuno como pan con mantequilla y bebo leche. Para el almuerzo prefiero arroz con pollo.

La cena es más ligera. A veces como sopa y ensalada.`,
    keywords: [
      { id: 31, word: 'comida', translation: '食物, 餐', phonetic: '/koˈmi.ða/', examples: ['La comida está rica.', 'Preparo la comida.'] },
      { id: 32, word: 'desayuno', translation: '早餐', phonetic: '/de.saˈʒu.no/', examples: ['El desayuno es a las ocho.', 'Como frutas en el desayuno.'] },
      { id: 33, word: 'almuerzo', translation: '午餐', phonetic: '/alˈmweɾ.θo/', examples: ['El almuerzo es al mediodía.', '¿Qué comes en el almuerzo?'] },
      { id: 34, word: 'cena', translation: '晚餐', phonetic: '/ˈθe.na/', examples: ['La cena está lista.', 'Cenamos juntos.'] },
      { id: 35, word: 'pan', translation: '面包', phonetic: '/pan/', examples: ['Compro pan fresco.', 'El pan está caliente.'] },
      { id: 36, word: 'leche', translation: '牛奶', phonetic: '/ˈle.tʃe/', examples: ['Bebo leche cada mañana.', 'La leche está fría.'] },
    ],
    phrases: [
      { phrase: '...es muy importante para...', translation: '...对...很重要', usage: '用于强调重要性' },
      { phrase: 'Para el...como...', translation: '...吃...', usage: '用于描述饮食' },
    ]
  },
  {
    id: 7,
    title: 'Los Animales',
    titleCN: '动物',
    level: 'A1',
    order: 7,
    illustration: '🐾',
    content: `Los animales son nuestros amigos. En casa tengo un perro y dos gatos.

Mi perro se llama Max. Es grande y tiene el pelo marrón. Le gusta jugar en el jardín.

Los gatos son pequeños y喜欢吃鱼. Duermen mucho durante el día.`,
    keywords: [
      { id: 37, word: 'animal', translation: '动物', phonetic: '/aˈni.mal/', examples: ['El animal es doméstico.', 'Los animales necesitan agua.'] },
      { id: 38, word: 'perro', translation: '狗', phonetic: '/ˈpe.ro/', examples: ['Mi perro es pequeño.', 'El perro ladra mucho.'] },
      { id: 39, word: 'gato', translation: '猫', phonetic: '/ˈɡa.to/', examples: ['El gato duerme.', 'Tengo un gato gris.'] },
      { id: 40, word: 'grande', translation: '大的', phonetic: '/ˈɡɾan.de/', examples: ['La casa es grande.', 'El perro es grande.'] },
      { id: 41, word: 'pequeño', translation: '小的', phonetic: '/peˈke.ɲo/', examples: ['El gato es pequeño.', 'Tengo un perro pequeño.'] },
    ],
    phrases: [
      { phrase: 'Mi...se llama...', translation: '我的...叫...', usage: '用于介绍宠物名字' },
      { phrase: 'Le gusta...', translation: '他/她/它喜欢...', usage: '用于描述喜好' },
    ]
  },
  {
    id: 8,
    title: 'El Tiempo',
    titleCN: '天气',
    level: 'A1',
    order: 8,
    illustration: '☀️',
    content: `Hoy el tiempo está muy bueno. El sol brilla y no hay nubes en el cielo.

Hace calor en verano y hace frío en invierno. En primavera llueve a veces.

Cuando hace buen tiempo, me gusta salir a caminar por el parque.`,
    keywords: [
      { id: 42, word: 'tiempo', translation: '天气, 时间', phonetic: '/ˈtjem.po/', examples: ['¿Qué tiempo hace hoy?', 'No tengo tiempo.'] },
      { id: 43, word: 'sol', translation: '太阳', phonetic: '/sol/', examples: ['El sol sale por la mañana.', 'Hace sol hoy.'] },
      { id: 44, word: 'lluvia', translation: '雨', phonetic: '/ˈʎu.bja/', examples: ['La lluvia cae.', 'No quiero salir con lluvia.'] },
      { id: 45, word: 'calor', translation: '热', phonetic: '/kaˈloɾ/', examples: ['Hace mucho calor.', 'Tengo calor.'] },
      { id: 46, word: 'frío', translation: '冷', phonetic: '/ˈfɾi.o/', examples: ['Hace frío.', 'Tengo frío.'] },
    ],
    phrases: [
      { phrase: 'Hace...', translation: '天气...', usage: '用于描述天气状况' },
      { phrase: '¿Qué tiempo hace?', translation: '天气怎么样？', usage: '用于询问天气' },
    ]
  },
  {
    id: 9,
    title: 'Las Partes del Cuerpo',
    titleCN: '身体部位',
    level: 'A1',
    order: 9,
    illustration: '💪',
    content: `El cuerpo humano tiene muchas partes. La cabeza tiene ojos, nariz, boca y orejas.

Los brazos y las piernas nos ayudan a movernos. Con las manos podemos tocar y escribir.

Cuido mi cuerpo comiendo bien y haciendo ejercicio todos los días.`,
    keywords: [
      { id: 47, word: 'cabeza', translation: '头', phonetic: '/kaˈbe.θa/', examples: ['Me duele la cabeza.', 'La cabeza es importante.'] },
      { id: 48, word: 'ojo', translation: '眼睛', phonetic: '/ˈo.xo/', examples: ['Tengo los ojos marrones.', 'Abre los ojos.'] },
      { id: 49, word: 'boca', translation: '嘴', phonetic: '/ˈbo.ka/', examples: ['Abre la boca.', 'La boca es importante para comer.'] },
      { id: 50, word: 'mano', translation: '手', phonetic: '/ˈma.no/', examples: ['Dame la mano.', 'Escribo con la mano.'] },
      { id: 51, word: 'pie', translation: '脚', phonetic: '/pje/', examples: ['Me duele el pie.', 'Pisas con el pie.'] },
    ],
    phrases: [
      { phrase: '...me duele...', translation: '...疼/痛...', usage: '用于描述身体不适' },
      { phrase: '...nos ayudan a...', translation: '...帮助我们...', usage: '用于描述功能' },
    ]
  },
  {
    id: 10,
    title: 'Los Días de la Semana',
    titleCN: '一周七天',
    level: 'A1',
    order: 10,
    illustration: '📅',
    content: `La semana tiene siete días. Lunes, martes, miércoles, jueves y viernes son días laborales.

El fin de semana es sábado y domingo. El sábado descanso y el domingo paso tiempo con mi familia.

Cada día es diferente y especial a su manera.`,
    keywords: [
      { id: 52, word: 'día', translation: '天', phonetic: '/di.a/', examples: ['Hoy es un buen día.', '¿Qué día es hoy?'] },
      { id: 53, word: 'semana', translation: '周', phonetic: '/seˈma.na/', examples: ['Esta semana viajo.', 'La semana tiene siete días.'] },
      { id: 54, word: 'lunes', translation: '星期一', phonetic: '/ˈlu.nes/', examples: ['El lunes empiezo a trabajar.', 'Lunes es el primer día.'] },
      { id: 55, word: 'viernes', translation: '星期五', phonetic: '/ˈbjeɾ.nes/', examples: ['El viernes es mi día favorito.', '¿Tienes planes el viernes?'] },
      { id: 56, word: 'fin de semana', translation: '周末', phonetic: '/fin de seˈma.na/', examples: ['Descanso el fin de semana.', '¿Qué haces el fin de semana?'] },
    ],
    phrases: [
      { phrase: '...es día laboral', translation: '...是工作日', usage: '用于区分工作日和休息日' },
      { phrase: 'Cada día es...', translation: '每一天都是...', usage: '用于描述日常' },
    ]
  }
]

export const getArticlesByLevel = (level: 'A1' | 'A2'): Article[] => {
  return articles.filter(article => article.level === level).sort((a, b) => a.order - b.order)
}

export const getArticleById = (id: number): Article | undefined => {
  return articles.find(article => article.id === id)
}

export const getTotalArticleCount = (): number => {
  return articles.length
}

export const getArticleCountByLevel = (level: 'A1' | 'A2'): number => {
  return articles.filter(article => article.level === level).length
}
