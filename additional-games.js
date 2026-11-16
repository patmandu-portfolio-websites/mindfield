// Each question lists the correct answer first, followed by three distractors.
const additionalQuestionRows = {
  Wordplay: [
    ["Which word is a synonym for 'rapid'?", "Quick", "Slow", "Quiet", "Heavy", "Rapid means quick."],
    ["Which word is an antonym of 'generous'?", "Stingy", "Kind", "Giving", "Helpful", "A stingy person is unwilling to share."],
    ["Which word rhymes with 'light'?", "Bright", "Late", "Let", "Lot", "Bright and light share the same ending sound."],
    ["Which word is spelled correctly?", "Necessary", "Neccessary", "Necesary", "Neccesary", "Necessary has one c and two s's."],
    ["Which word can follow both 'rain' and 'snow' to make compound words?", "Fall", "Book", "Chair", "Glass", "Rainfall and snowfall are compound words."],
    ["Which word is a homophone of 'sea'?", "See", "Say", "Saw", "Sew", "Sea and see sound alike."],
    ["What is the plural of 'child'?", "Children", "Childs", "Childes", "Childrens", "Children is an irregular plural."],
    ["Which word means the opposite of 'ancient'?", "Modern", "Old", "Historic", "Antique", "Modern means belonging to recent times."],
    ["Which word is a synonym for 'enormous'?", "Huge", "Tiny", "Narrow", "Brief", "Enormous and huge both mean very large."],
    ["Which word can precede both 'brush' and 'paste'?", "Tooth", "Rain", "Foot", "Sun", "Toothbrush and toothpaste start with tooth."],
    ["Which word is a homophone of 'knight'?", "Night", "Neat", "Net", "Knot", "Knight and night sound alike."],
    ["Which word is an antonym of 'scarce'?", "Abundant", "Rare", "Limited", "Few", "Abundant means plentiful, the opposite of scarce."],
    ["Which word contains a silent letter?", "Knee", "Nest", "King", "Kind", "The k in knee is silent."],
    ["Which is an anagram of 'listen'?", "Silent", "Little", "Listed", "Linger", "Silent uses the same six letters as listen."],
    ["Which word is spelled correctly?", "Separate", "Seperate", "Seperete", "Separrate", "Separate has an a in its middle syllable."],
    ["What is the plural of 'mouse' when referring to the animal?", "Mice", "Mouses", "Mices", "Meese", "Mice is an irregular plural."],
  ],
  Spatial: [
    ["A square turns a quarter-turn. What shape is it still?", "A square", "A triangle", "A circle", "A pentagon", "Rotation changes orientation, not shape."],
    ["How many faces does a cube have?", "6", "4", "8", "12", "A cube has six square faces."],
    ["A triangle is reflected in a mirror. How many sides does the reflection have?", "3", "2", "4", "6", "Reflection preserves the number of sides."],
    ["Which shape has a continuous curved boundary and no corners?", "A circle", "A square", "A triangle", "A rectangle", "A circle has a continuous curved boundary."],
    ["Which solid has two circular faces and one curved surface?", "A cylinder", "A cube", "A sphere", "A pyramid", "A cylinder has two circular ends."],
    ["An arrow points up and turns clockwise a half-turn. Where does it point?", "Down", "Right", "Left", "Up", "A half-turn reverses the arrow."],
    ["How many corners does a rectangular box have?", "8", "4", "6", "12", "A rectangular box has eight vertices."],
    ["Which shape has five sides?", "Pentagon", "Hexagon", "Square", "Triangle", "A pentagon has five sides."],
    ["An arrow points right and turns counterclockwise a quarter-turn. Where does it point?", "Up", "Down", "Left", "Right", "A counterclockwise quarter-turn from right points up."],
    ["How many edges does a cube have?", "12", "6", "8", "10", "A cube has twelve edges."],
    ["Which solid has a circular base and comes to one point?", "A cone", "A cylinder", "A cube", "A sphere", "A cone narrows from its circular base to a point."],
    ["A rectangle is cut along a diagonal. What two shapes result?", "Two triangles", "Two circles", "Two pentagons", "Two squares", "A diagonal joins opposite corners and makes two triangles."],
    ["Which shape has six sides?", "Hexagon", "Pentagon", "Octagon", "Triangle", "A hexagon has six sides."],
    ["A cube is viewed straight on, with one face facing you. What shape is that face?", "Square", "Triangle", "Circle", "Pentagon", "Every face of a cube is square."],
    ["How many quarter-turns make one complete turn?", "4", "2", "3", "8", "Four 90-degree turns make 360 degrees."],
    ["Which solid can roll in any direction on a flat surface?", "A sphere", "A cube", "A square pyramid", "A rectangular box", "A sphere has a continuously curved surface."],
  ],
  Deduction: [
    ["All roses are flowers. This plant is a rose. What must it be?", "A flower", "A tree", "A vegetable", "Blue", "Every rose belongs to the group of flowers."],
    ["Ari is older than Bo; Bo is older than Cy. Who is youngest?", "Cy", "Ari", "Bo", "Cannot tell", "The order is Ari, Bo, then Cy by age."],
    ["No birds in a room are blue. A robin is a bird in the room. Can it be blue?", "No", "Yes", "Only at night", "Cannot tell", "The rule excludes blue birds from the room."],
    ["A box is either red or green. It is not red. What color is it?", "Green", "Red", "Blue", "Cannot tell", "Green is the only remaining option."],
    ["All squares are rectangles. This shape is a square. What follows?", "It is a rectangle", "It is a circle", "It has three sides", "It is red", "A square belongs to the group of rectangles."],
    ["Lia arrived before Max; Max arrived before Nat. Who arrived first?", "Lia", "Max", "Nat", "Cannot tell", "The order is Lia, Max, Nat."],
    ["Every ticket has a number. This is a ticket. What must it have?", "A number", "A photograph", "A barcode", "A signature", "The rule applies to every ticket."],
    ["Only one of two switches is on. The first is off. What is the second?", "On", "Off", "Broken", "Cannot tell", "Exactly one is on, so it must be the second."],
    ["All apples in a basket are ripe. This apple is in the basket. What follows?", "It is ripe", "It is green", "It is sweet", "It is large", "All apples in that basket are ripe."],
    ["Kim is taller than Lou, and Lou is taller than Mo. Who is tallest?", "Kim", "Lou", "Mo", "Cannot tell", "Kim is taller than both Lou and Mo."],
    ["A card is either a circle or a star. It is not a star. What is it?", "A circle", "A star", "A square", "Cannot tell", "The only alternative is a circle."],
    ["No squares are circles. This shape is a square. What must be true?", "It is not a circle", "It is red", "It is large", "It has five sides", "Squares and circles do not overlap in the rule."],
    ["All cats in a shelter are vaccinated. Nori is a cat in the shelter. What follows?", "Nori is vaccinated", "Nori is black", "Nori is young", "Nori is asleep", "The vaccination rule includes Nori."],
    ["P is left of Q, and Q is left of R. Which is rightmost?", "R", "P", "Q", "Cannot tell", "The left-to-right order is P, Q, R."],
    ["Exactly one of three cups hides a coin. Cups A and B are empty. Where is the coin?", "Cup C", "Cup A", "Cup B", "Outside the cups", "C is the only remaining cup."],
    ["Every student in the club has a badge. Sol is a student in the club. What follows?", "Sol has a badge", "Sol is the leader", "Sol has a book", "Sol is the youngest", "The rule applies to Sol."],
  ],
  Estimation: [
    ["About how long is a typical pencil?", "15 cm", "15 m", "15 km", "15 mm", "A pencil is commonly around 15 centimetres long."],
    ["About how much water fits in a standard household drinking glass?", "250 mL", "25 L", "25 mL", "250 L", "A drinking glass commonly holds around a quarter litre."],
    ["Which is closest to the length of a day?", "24 hours", "2 hours", "100 hours", "10 minutes", "A day lasts 24 hours."],
    ["About how many seconds are in one minute?", "60", "6", "600", "3600", "One minute is exactly 60 seconds."],
    ["Which is closest to the mass of an adult cat?", "4 kg", "4 g", "400 kg", "4000 kg", "An adult cat typically weighs a few kilograms."],
    ["About how tall is a typical interior door?", "2 m", "20 cm", "20 m", "2 km", "A typical door is roughly two metres tall."],
    ["Which is closest to the number of days in a year?", "365", "36", "100", "1000", "Most years have 365 days."],
    ["Which is closest to 49 + 51?", "100", "50", "500", "1000", "49 and 51 add to exactly 100."],
    ["About how many minutes are in two hours?", "120", "12", "60", "240", "Two hours contain 2 × 60 = 120 minutes."],
    ["Which is closest to the length of a small paperclip?", "3 cm", "3 m", "30 m", "3 km", "A small paperclip is a few centimetres long."],
    ["About how many millilitres are in a litre?", "1000", "10", "100", "10000", "One litre equals 1000 millilitres."],
    ["Which is closest to 198 + 203?", "400", "40", "200", "4000", "Rounding both numbers to 200 gives 400."],
    ["Which is closest to the mass of a typical apple?", "150 g", "150 kg", "1 g", "15 kg", "An apple typically weighs around 150 grams."],
    ["About how many days are in four weeks?", "28", "14", "40", "100", "Four weeks contain 4 × 7 = 28 days."],
    ["Which is closest to 9 × 21?", "190", "19", "90", "1900", "9 × 21 = 189, close to 190."],
    ["About how wide is an adult hand?", "10 cm", "10 m", "1 mm", "1 km", "A hand is roughly several centimetres wide."],
  ],
  "Everyday Physics": [
    ["Why does a dropped ball fall toward Earth?", "Gravity", "Magnetism", "Sound", "Friction alone", "Gravity pulls the ball toward Earth."],
    ["What happens to a shadow when an object blocks light?", "A darker area forms behind it", "The object emits light", "The light stops existing", "The object disappears", "The object prevents some light from reaching the surface."],
    ["Which surface generally produces more friction for a shoe?", "Rough pavement", "Smooth ice", "Wet glass", "Polished ice", "Rough pavement generally provides more grip than smooth ice."],
    ["Why does a metal lid loosen after warming?", "It expands slightly", "It shrinks", "Its mass disappears", "It becomes magnetic", "Most metals expand when warmed."],
    ["Which material is attracted to an ordinary magnet?", "Iron", "Wood", "Glass", "Paper", "Iron is a magnetic material."],
    ["What carries sound from a ringing bell to your ear?", "Vibrations in air", "Light rays", "Gravity waves", "Electric current in air", "Sound travels through vibrations of the air."],
    ["Why can you see yourself in a mirror?", "It reflects light", "It makes a copy", "It absorbs all light", "It produces your image as heat", "A mirror reflects light toward your eyes."],
    ["What generally happens to liquid water in a freezer?", "It freezes", "It boils", "It burns", "It becomes metal", "Cooling water sufficiently turns it into ice."],
    ["Why does a bicycle slow down when you stop pedalling on level ground?", "Friction and air resistance", "Gravity disappears", "The wheels lose all mass", "The ground pulls it forward", "Resistive forces oppose the bicycle's motion."],
    ["What form of energy does a stretched elastic band store?", "Elastic potential energy", "Nuclear energy", "Chemical energy only", "No energy", "Stretching stores elastic potential energy."],
    ["Which change turns liquid water into water vapor?", "Evaporation", "Freezing", "Melting", "Condensation", "Evaporation changes liquid into gas."],
    ["Why does a saucepan handle made of wood often feel cooler than its metal pan?", "Wood conducts heat less readily", "Wood has no temperature", "Metal makes cold", "Wood makes ice", "Wood transfers heat more slowly than metal."],
    ["What happens to a moving toy car when a force pushes it in its direction of travel?", "It can speed up", "It must disappear", "Its mass becomes zero", "It must turn around", "A force in the direction of motion can increase speed."],
    ["A transparent window lets most visible light do what?", "Pass through", "Stop permanently", "Turn into sound", "Become solid", "Transparent glass transmits much of the light."],
    ["Why do raindrops fall from clouds?", "Gravity pulls them down", "They are attracted to sound", "Clouds are magnets", "Sunlight pushes them down", "Gravity pulls raindrops toward Earth."],
    ["What happens when water vapor cools on a cold window?", "It can condense into droplets", "It becomes fire", "It turns into sand", "It becomes light", "Condensation changes water vapor into liquid droplets."],
  ],
  "Code Breaking": [
    ["Using A=1, B=2, C=3, what does 2-1-3 spell?", "BAC", "ABC", "CAB", "BCA", "2 is B, 1 is A, and 3 is C."],
    ["Shift each letter of CAT one step forward. What is the code?", "DBU", "BZS", "DBT", "CBU", "C→D, A→B and T→U."],
    ["Using A=1, B=2, C=3, what does 3-1-2 spell?", "CAB", "ABC", "BAC", "CBA", "3 is C, 1 is A, and 2 is B."],
    ["A code reverses each word. What is DOG encoded as?", "GOD", "DGO", "ODG", "GDO", "Reversing DOG gives GOD."],
    ["Shift each letter of BEE one step forward. What is the code?", "CFF", "ADD", "CEF", "CFD", "B→C and each E→F."],
    ["A=1, B=2, C=3, D=4. What number represents D?", "4", "1", "2", "3", "D is the fourth letter."],
    ["A code reverses each word. Decode TAC.", "CAT", "ACT", "TAC", "ATC", "TAC reversed is CAT."],
    ["If ★ means 5 and ● means 2, what is ★ + ●?", "7", "3", "10", "25", "Replace the symbols: 5 + 2 = 7."],
    ["Shift each letter of DOG one step forward. What is the code?", "EPH", "CNF", "EOG", "DOH", "D→E, O→P and G→H."],
    ["Using A=1, B=2, C=3, what does 1-3-2 spell?", "ACB", "ABC", "CAB", "BAC", "1 is A, 3 is C, and 2 is B."],
    ["A code reverses each word. What is TOP encoded as?", "POT", "OPT", "TPO", "OTP", "TOP reversed is POT."],
    ["If ▲ means 3 and ■ means 4, what is ▲ × ■?", "12", "7", "1", "34", "Replace the symbols: 3 × 4 = 12."],
    ["Shift each letter of FISH one step forward. What is the code?", "GJTI", "EHRG", "GISH", "GJSH", "F→G, I→J, S→T and H→I."],
    ["A=1 through Z=26. Which letter is 5?", "E", "D", "F", "A", "E is the fifth letter."],
    ["A code reverses each word. Decode NUS.", "SUN", "NUS", "UNS", "SNU", "NUS reversed is SUN."],
    ["If ◆ means 8 and ○ means 3, what is ◆ − ○?", "5", "11", "24", "3", "Replace the symbols: 8 − 3 = 5."],
  ],
  Perspective: [
    ["A mug is directly in front of a book. From your viewpoint, which is closer?", "The mug", "The book", "Both equally", "Cannot tell", "The mug is directly in front of the book from your viewpoint."],
    ["Looking straight down at the top of a closed cylindrical can, what shape is visible?", "A circle", "A triangle", "A rectangle", "A pentagon", "The can's top is circular."],
    ["On a straight road, identical cars farther away generally appear what?", "Smaller", "Larger", "The same apparent size", "Invisible by definition", "Objects subtend a smaller visual angle farther away."],
    ["You face north and turn right. Which direction do you face?", "East", "West", "South", "North", "A right turn from north points east."],
    ["Looking straight at one square face of a cube, what shape is that face?", "A square", "A circle", "A triangle", "A hexagon", "Each cube face is square."],
    ["You face east and turn left. Which direction do you face?", "North", "South", "West", "East", "A left turn from east points north."],
    ["A tree hides part of a house from your view. Which is closer to you?", "The tree", "The house", "They must be equally distant", "Cannot tell", "The tree blocks your view because it is in front of that part of the house."],
    ["A photograph shows a coin face-on. What shape is its outline?", "A circle", "A square", "A triangle", "A star", "A circular coin viewed face-on has a circular outline."],
    ["You face south and turn right. Which direction do you face?", "West", "East", "North", "South", "A right turn from south points west."],
    ["Looking straight down at a rectangular tabletop, what shape is its outline?", "Rectangle", "Circle", "Triangle", "Pentagon", "Viewed from directly above, its rectangular outline remains visible."],
    ["Two identical lamps are at different distances. Which generally appears larger?", "The nearer lamp", "The farther lamp", "Both always appear identical", "Neither has a size", "The nearer object subtends a larger visual angle."],
    ["You face west and turn left. Which direction do you face?", "South", "North", "East", "West", "A left turn from west points south."],
    ["A person stands between you and a sign, blocking it. What is closer to you?", "The person", "The blocked part of the sign", "They are equally close", "Cannot tell", "The person is in front of the blocked part of the sign."],
    ["A book lies flat. Looking directly at its rectangular cover, what shape is the cover?", "Rectangle", "Circle", "Triangle", "Sphere", "The book's cover is rectangular."],
    ["You face north and turn around. Which direction do you face?", "South", "East", "West", "North", "A half-turn from north points south."],
    ["Parallel railway tracks seem to meet in the distance. Why?", "Perspective", "The tracks actually join at the horizon", "Gravity bends the tracks together", "They get physically narrower", "Perspective makes parallel lines appear to converge."],
  ],
  Balance: [
    ["A balanced scale has 3 identical coins on one side. How many identical coins balance it on the other?", "3", "1", "2", "4", "Equal numbers of identical coins have equal weight."],
    ["A seesaw has equal weights at equal distances from the pivot. What happens?", "It balances", "The left must fall", "The right must fall", "It must spin", "Equal weights at equal distances have equal turning effects."],
    ["One side of a balance holds 2 kg. Which balances it?", "Two 1 kg weights", "One 1 kg weight", "One 3 kg weight", "Four 1 kg weights", "Two 1 kg weights total 2 kg."],
    ["On a seesaw, where does the same force create more turning effect?", "Farther from the pivot", "At the pivot", "Closer to the pivot", "Distance makes no difference", "Turning effect increases with distance from the pivot."],
    ["A level balance has 5 identical blocks on each side. Remove one from each side. What happens?", "It remains balanced", "Left falls", "Right falls", "Both sides rise permanently", "Each side still has four identical blocks."],
    ["A 4 kg weight balances two identical weights. How heavy is each?", "2 kg", "1 kg", "3 kg", "4 kg", "Two equal weights totaling 4 kg each weigh 2 kg."],
    ["Equal weights sit on opposite sides of a pivot. Which side has more turning effect if it is farther out?", "The farther side", "The nearer side", "Neither", "The pivot itself", "The larger distance gives a greater turning effect."],
    ["A balance has 6 marbles on one side and 4 identical marbles on the other. How many add to the lighter side?", "2", "1", "3", "6", "Adding two gives six marbles on each side."],
    ["A balance holds 3 kg on each side. Add 1 kg to both sides. What happens?", "It stays balanced", "Left falls", "Right falls", "It loses weight", "Both sides now hold 4 kg."],
    ["A 6 kg load balances three identical weights. How heavy is each?", "2 kg", "1 kg", "3 kg", "6 kg", "6 kg divided equally among three weights is 2 kg each."],
    ["Two equal weights are equally far from a seesaw pivot. Move the left one farther out. Which way does it tip?", "Left", "Right", "It stays level", "Neither side can move", "The left weight now has the greater turning effect."],
    ["A pan has a 2 kg weight. Which combination balances it?", "Four 500 g weights", "Two 500 g weights", "One 500 g weight", "Six 500 g weights", "Four lots of 500 g make 2000 g, or 2 kg."],
    ["A balance has 7 identical coins on each side. Remove 2 from the right only. Which side is heavier?", "Left", "Right", "They remain equal", "Cannot tell", "Seven coins weigh more than five identical coins."],
    ["A child moves closer to the pivot on their side of a seesaw. What happens to their turning effect?", "It decreases", "It increases", "It stays identical", "Their weight becomes zero", "The same weight acts at a shorter distance from the pivot."],
    ["A 10 kg weight balances two identical weights. What does each weigh?", "5 kg", "2 kg", "8 kg", "10 kg", "Each of the two equal weights is half of 10 kg."],
    ["A balance has 8 identical stones on one side and 5 on the other. How many remove from the heavier side?", "3", "2", "5", "8", "Removing three leaves five on each side."],
  ],
  Probability: [
    ["A fair coin is tossed. What is the chance of heads?", "1/2", "1/4", "1/3", "1", "One of two equally likely outcomes is heads."],
    ["A fair six-sided die is rolled. What is the chance of rolling a 3?", "1/6", "1/2", "1/3", "1", "One of six equally likely faces is 3."],
    ["A bag has 3 red balls and 1 blue ball. What is the chance of red?", "3/4", "1/4", "1/2", "1", "Three of the four equally likely balls are red."],
    ["A fair die is rolled. What is the chance of an even number?", "1/2", "1/6", "1/3", "1", "Three of six faces, 2, 4 and 6, are even."],
    ["A bag contains only green balls. What is the chance of drawing green?", "1", "0", "1/2", "1/4", "Every ball in the bag is green."],
    ["A fair coin is tossed. What is the chance of rolling a 6 on that coin?", "0", "1/2", "1/6", "1", "A coin toss has no die face."],
    ["A bag has 2 red and 2 blue balls. What is the chance of blue?", "1/2", "1/4", "3/4", "1", "Two of the four balls are blue."],
    ["A fair die is rolled. What is the chance of a number greater than 4?", "1/3", "1/6", "1/2", "2/3", "Two of six faces, 5 and 6, are greater than 4."],
    ["A fair coin is tossed twice. What is the chance of two heads?", "1/4", "1/2", "3/4", "1", "Only HH among HH, HT, TH and TT has two heads."],
    ["A fair die is rolled. What is the chance of a number less than 3?", "1/3", "1/6", "1/2", "2/3", "Two of six faces, 1 and 2, are less than 3."],
    ["A bag has 1 red and 4 blue balls. What is the chance of red?", "1/5", "1/4", "1/2", "4/5", "One of the five balls is red."],
    ["A fair die is rolled. What is the chance of an odd number?", "1/2", "1/6", "1/3", "1", "Three of the six faces are odd."],
    ["A bag contains 5 yellow balls and no others. What is the chance of blue?", "0", "1/5", "1/2", "1", "There are no blue balls in the bag."],
    ["A fair coin is tossed twice. What is the chance of at least one head?", "3/4", "1/4", "1/2", "1", "HH, HT and TH each contain at least one head."],
    ["A bag has 3 red and 3 green balls. What is the chance of green?", "1/2", "1/3", "1/6", "1", "Three of the six balls are green."],
    ["A fair die is rolled. What is the chance of a number at most 5?", "5/6", "1/6", "1/2", "1", "Five of the six faces are at most 5."],
  ],
  "Word Ladders": [
    ["Change one letter in CAT to make a sleeping place.", "COT", "BED", "DOG", "NEST", "CAT → COT changes A to O."],
    ["Change one letter in HAT to make an animal.", "CAT", "DOG", "HEN", "COW", "HAT → CAT changes H to C."],
    ["Change one letter in COLD to make a word meaning sold for money.", "SOLD", "GOLD", "TOLD", "OLDER", "COLD → SOLD changes C to S."],
    ["Change one letter in PIG to make a word meaning large.", "BIG", "DOG", "COW", "HORSE", "PIG → BIG changes P to B."],
    ["Change one letter in SUN to make a word meaning enjoyment.", "FUN", "PLAY", "RUNS", "GAME", "SUN → FUN changes S to F."],
    ["Change one letter in PAN to make a vehicle.", "VAN", "CAR", "BUS", "TRAIN", "PAN → VAN changes P to V."],
    ["Change one letter in BOOK to make something you do with food.", "COOK", "EAT", "BAKE", "MEAL", "BOOK → COOK changes B to C."],
    ["Change one letter in CAKE to make a body of water.", "LAKE", "SEA", "RIVER", "POND", "CAKE → LAKE changes C to L."],
    ["Change one letter in DOG to make a piece of a tree trunk.", "LOG", "BOX", "TREE", "WOOD", "DOG → LOG changes D to L."],
    ["Change one letter in RAIN to make a path for a train.", "RAIL", "ROAD", "TRACK", "LANE", "RAIN → RAIL changes N to L."],
    ["Change one letter in FISH to make a container for food.", "DISH", "BOWL", "PLATE", "CUP", "FISH → DISH changes F to D."],
    ["Change one letter in COLD to make a precious metal.", "GOLD", "IRON", "SILVER", "TIN", "COLD → GOLD changes C to G."],
    ["Change one letter in BEAR to make a word meaning to perceive sound.", "HEAR", "EAR", "BEER", "EARS", "BEAR → HEAR changes B to H."],
    ["Change one letter in FARM to make a word meaning moderately hot.", "WARM", "ARM", "FIRM", "HARM", "FARM → WARM changes F to W."],
    ["Change one letter in SAND to make a word meaning solid ground.", "LAND", "ISLE", "ISLAND", "SEA", "SAND → LAND changes S to L."],
    ["Change one letter in TREE to make a word meaning without cost.", "FREE", "THREE", "TWO", "FOUR", "TREE → FREE changes T to F."],
  ],
  Math: [
    ["What is 36 + 48?", "84", "74", "86", "94", "36 + 48 = 84."],
    ["What is 93 − 47?", "46", "44", "56", "50", "93 − 47 = 46."],
    ["What is 9 × 6?", "54", "48", "56", "63", "9 × 6 = 54."],
    ["What is 64 ÷ 8?", "8", "6", "7", "9", "64 ÷ 8 = 8."],
    ["What is 10% of 250?", "25", "10", "20", "50", "One tenth of 250 is 25."],
    ["What is ⅓ + ⅓?", "⅔", "½", "⅓", "1", "One third plus one third equals two thirds."],
    ["What comes next: 3, 6, 9, 12?", "15", "13", "14", "16", "The sequence increases by 3."],
    ["A rectangle is 5 cm by 3 cm. What is its area?", "15 cm²", "8 cm²", "16 cm²", "30 cm²", "Area is 5 × 3 = 15 square centimetres."],
    ["What is 125 + 75?", "200", "150", "190", "210", "125 + 75 = 200."],
    ["What is 100 − 64?", "36", "34", "46", "56", "100 − 64 = 36."],
    ["What is 12 × 7?", "84", "72", "77", "96", "12 × 7 = 84."],
    ["What is 144 ÷ 12?", "12", "10", "11", "14", "144 ÷ 12 = 12."],
    ["What is 50% of 90?", "45", "30", "40", "50", "Half of 90 is 45."],
    ["What is ¾ − ¼?", "½", "¼", "⅓", "1", "Three quarters minus one quarter is two quarters, or one half."],
    ["What comes next: 2, 5, 8, 11?", "14", "12", "13", "15", "The sequence increases by 3."],
    ["A square has sides of 4 cm. What is its perimeter?", "16 cm", "8 cm", "12 cm", "20 cm", "Four sides of 4 cm total 16 cm."],
  ],
};

const additionalGames = {};
const questionHints = {
  Wordplay: "Think about the meaning, spelling or sound of each option.",
  Spatial: "Picture the shape or turn before choosing.",
  Deduction: "Use only the facts given in the question.",
  Estimation: "Compare the options with an everyday reference.",
  "Everyday Physics": "Think about the physical process involved.",
  "Code Breaking": "Apply the stated rule one symbol at a time.",
  Perspective: "Picture the viewpoint or turn described.",
  Balance: "Compare the weights and their distances from the pivot.",
  Probability: "Count the favorable outcomes and the total equally likely outcomes.",
  "Word Ladders": "Compare the words letter by letter.",
  Math: "Work through the calculation one step at a time.",
};
for (const [name, rows] of Object.entries(additionalQuestionRows)) {
  const questions = rows.map(([q, correct, ...rest], i) => {
    const explain = rest.pop();
    const choices = [correct, ...rest];
    const answer = i % choices.length;
    [choices[0], choices[answer]] = [choices[answer], choices[0]];
    return { type: name, icon: "✦", q, choices, answer, hint: questionHints[name], explain };
  });
  additionalGames[name] = [questions.slice(0, 8), questions.slice(8, 16)];
}

const memorySequences = [
  "3 8 1 6", "5 2 9 4", "7 1 4 8", "2 6 3 9",
  "4 9 2 7", "8 3 5 1", "6 1 9 2", "9 4 7 3",
  "2 8 5 1 6", "7 3 9 4 1", "5 1 8 2 6", "9 2 4 7 3",
  "4 7 1 5 8", "6 3 9 1 2", "8 5 2 4 7", "1 9 6 3 5",
];
const memoryQuestions = memorySequences.map((sequence, i) => {
  const visual = sequence.split(" ");
  const alternatives = [
    visual,
    [visual[1], visual[0], ...visual.slice(2)],
    [visual[0], visual[2], visual[1], ...visual.slice(3)],
    [...visual.slice(0, -2), visual[visual.length - 1], visual[visual.length - 2]],
  ].map((items) => items.join(" · "));
  const answer = i % 4;
  [alternatives[0], alternatives[answer]] = [alternatives[answer], alternatives[0]];
  return {
    type: "Memory", icon: "◉", memory: true, visual,
    q: "Which number sequence did you see?",
    choices: alternatives, answer,
    hint: "Recall the digits in their original order.",
    explain: `The sequence was ${visual.join(", ")}.`,
  };
});
additionalGames.Memory = [memoryQuestions.slice(0, 8), memoryQuestions.slice(8)];

const motionRows = [
  ["travel", "The marker travels from A to B. Which direction does it move?", "Right", "Left", "Up", "Down", "The marker moves from A on the left toward B on the right."],
  ["fill", "The tank fills from the bottom. What happens to the water level?", "It rises", "It falls", "It stays fixed", "It moves sideways only", "The top of the water rises as the tank fills."],
  ["sequence", "The numbered lights repeat 1, 2, 3, 4. Which lights up after 4?", "1", "2", "3", "4 again", "After 4, the sequence starts again at 1."],
  ["scale", "The circle grows and shrinks. When it grows, what happens to its diameter?", "It increases", "It decreases", "It stays the same", "It becomes a triangle", "A larger circle has a larger diameter."],
  ["mirror", "The two markers move apart from the center. Which moves to the left?", "The left marker", "The right marker", "Both markers", "Neither marker", "The left marker moves left while the right marker moves right."],
  ["travel", "The marker starts at A and ends at B. If A is 0 and B is 10, what is halfway?", "5", "2", "8", "10", "The midpoint between 0 and 10 is 5."],
  ["fill", "If the tank fills at a steady rate, when is it half full?", "Halfway through filling", "Only at the start", "Only when full", "After it empties", "At a steady rate, half the filling time gives half the volume."],
  ["sequence", "The numbered lights repeat 1, 2, 3, 4. Which number comes between 2 and 4?", "3", "1", "2", "4", "The order is 1, 2, 3, 4."],
  ["scale", "When the growing circle reaches its largest size, what happens next?", "It shrinks", "It keeps growing forever", "It stops permanently", "It becomes a square", "The animation reverses and the circle gets smaller."],
  ["mirror", "The two markers move apart, then return. What happens to the distance between them on the return?", "It decreases", "It increases", "It stays fixed", "It doubles", "The markers move back toward each other, decreasing the gap."],
  ["travel", "If the marker moves from A to B in 4 seconds at a steady speed, how long does half the distance take?", "2 seconds", "1 second", "4 seconds", "8 seconds", "At a steady speed, half the distance takes half the time."],
  ["fill", "The tank holds 8 cups when full. How much does it hold when half full?", "4 cups", "2 cups", "6 cups", "8 cups", "Half of 8 cups is 4 cups."],
  ["sequence", "If the lights continue 1, 2, 3, 4, 1, what comes next?", "2", "1", "3", "4", "The repeating sequence continues with 2 after 1."],
  ["scale", "The circle returns to its starting size after growing. Has its shape changed?", "No, it is still a circle", "Yes, it is a square", "Yes, it is a triangle", "It has no shape", "Scaling changes the circle's size, not its shape."],
  ["mirror", "The markers start together, move apart, and return together. Which point do they return to?", "The center", "The left edge", "The right edge", "Different corners", "Both markers return to the center."],
  ["travel", "The marker travels 10 units from A to B. How far is a point 2 units before B from A?", "8 units", "2 units", "10 units", "12 units", "A point 2 units before B is 10 − 2 = 8 units from A."],
];
const motionQuestions = motionRows.map(([motion, q, correct, ...rest], i) => {
  const explain = rest.pop();
  const choices = [correct, ...rest];
  const answer = i % 4;
  [choices[0], choices[answer]] = [choices[answer], choices[0]];
  return { type: "Motion", icon: "↝", motion, q, choices, answer, hint: "Follow the motion or sequence described.", explain };
});
additionalGames["Animated puzzles"] = [motionQuestions.slice(0, 8), motionQuestions.slice(8)];

const soundRows = [
  [[220, 330, 440], "Do the three tones go up, down, or stay the same?", "Up", "Down", "Stay the same", "Down then up", "Each tone is higher than the one before it."],
  [[440, 330, 220], "Which tone is lowest?", "Third", "First", "Second", "All are equal", "The third tone has the lowest pitch."],
  [[330, 330, 330, 330], "How many beeps do you hear?", "4", "2", "3", "5", "There are four beeps."],
  [[330, 0, 330, 330], "What rhythm do you hear?", "Beep, rest, beep, beep", "Beep, beep, rest, beep", "Four beeps", "Beep, rest, rest, beep", "A silent beat follows the first beep, then two beeps sound."],
  [[220, 440, 220, 440], "The low–high pattern repeats. What pitch would come next?", "Low", "High", "Middle", "Silence", "Low and high alternate, so low follows high."],
  [[220, 440, 220], "Which two tones have the same pitch?", "First and third", "First and second", "Second and third", "None", "The first and third tones are both low."],
  [[330, 0, 0, 330], "How many silent beats are between the two beeps?", "2", "0", "1", "3", "Two silent beats separate the beeps."],
  [[440, 220, 330], "Where is the highest tone?", "First", "Second", "Third", "All are equal", "The first tone is highest."],
  [[220, 330, 220, 330, 220, 330], "Which two-tone group repeats?", "Low, then high", "High, then low", "Low, then low", "High, then high", "The six tones repeat low, high three times."],
  [[330, 330, 0, 330], "What rhythm do you hear?", "Beep, beep, rest, beep", "Beep, rest, beep, beep", "Four beeps", "Rest, beep, rest, beep", "Two beeps are followed by a rest and a final beep."],
  [[330, 440, 330], "Does the pitch rise, fall, or do both?", "Rises then falls", "Falls then rises", "Only rises", "Stays the same", "The second tone is higher, then the third returns to the first pitch."],
  [[220, 220, 440, 220, 220, 440], "How many low tones come before each high tone?", "2", "1", "3", "4", "The repeated group is low, low, high."],
  [[330, 0, 330, 0, 330], "How many beeps do you hear, ignoring the silent beats?", "3", "2", "4", "5", "There are three beeps separated by two rests."],
  [[440, 220, 330, 220], "Which tone is highest?", "First", "Second", "Third", "Fourth", "The first tone is the highest pitch."],
  [[330, 330, 440, 330], "Which tone differs in pitch from the other three?", "Third", "First", "Second", "Fourth", "The third tone is higher than the other three."],
  [[440, 330, 220, 330], "What happens to the pitch after the lowest tone?", "It rises", "It falls", "It stays the same", "The clue ends immediately", "The final tone rises from the third, lowest tone."],
];
const soundQuestions = soundRows.map(([sound, q, correct, ...rest], i) => {
  const explain = rest.pop();
  const choices = [correct, ...rest];
  const answer = i % 4;
  [choices[0], choices[answer]] = [choices[answer], choices[0]];
  return { type: "Sound", icon: "♫", sound, q, choices, answer, hint: "Play the clue again and listen for changes or silent beats.", explain };
});
additionalGames.Sound = [soundQuestions.slice(0, 8), soundQuestions.slice(8)];
