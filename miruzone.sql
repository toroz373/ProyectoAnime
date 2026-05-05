-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-05-2026 a las 15:19:39
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `miruzone`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `animes`
--

CREATE TABLE `animes` (
  `id` int(11) NOT NULL,
  `api_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `animes`
--

INSERT INTO `animes` (`id`, `api_id`, `title`, `image`, `description`, `created_at`) VALUES
(1, 29, 'Zipang', 'https://myanimelist.net/images/anime/13/75740.jpg', 'A Ripple in Time Turns the Crucial Tide of WWII.\n\nScheduled for routine military exercises, Commander Kadomatsu and the crew of Japan\'s newest and most modern Battlecruiser, The Mirai, are ready to test out the ship\'s state-of-the-art Aegis System. Instead, they find themselves transported back to June 4th, 1942—date of the crucial Battle of Midway, where the Japanese fleet was dealt a crippling blow. When an overzealous Kadomatsu rescues one of the battle\'s victims, Kusaka, from a sinking zero fighter, the Mirai\'s fate is sealed. The crew pledges not to do anything to alter the past further. However, they\'re now forced to fight a U.S. submarine in a battle that should never have occurred. Thus setting off a chain of events that may forever change the flow of history!\n\n(Source: Geneon Entertainment USA, edited)', '2026-04-21 16:39:08'),
(2, 8, 'Bouken Ou Beet', 'https://myanimelist.net/images/anime/7/21569.jpg', 'It is the dark century and the people are suffering under the rule of the devil, Vandel, who is able to manipulate monsters. The Vandel Busters are a group of people who hunt these devils, and among them, the Zenon Squad is known to be the strongest busters on the continent. A young boy, Beet, dreams of joining the Zenon Squad. However, one day, as a result of Beet\'s fault, the Zenon squad was defeated by the devil, Beltose. The five dying busters sacrificed their life power into their five weapons, Saiga. After giving their weapons to Beet, they passed away. Years have passed since then and the young Vandel Buster, Beet, begins his adventure to carry out the Zenon Squad\'s will to put an end to the dark century.', '2026-04-21 16:39:08'),
(3, 7, 'Witch Hunter Robin', 'https://myanimelist.net/images/anime/10/19969.jpg', 'Though hidden away from the general public, Witches—those with supernatural powers—have always existed in human societies. Neither numerous nor inherently evil, Witches are nonetheless capable of creating disorder by misusing their powers for criminal means. The task of solving supernatural crimes falls outside of the jurisdiction of normal authorities and is instead handled by the Solomon organization.\n\nHaving finished her training in Italy, Robin Sena transfers to Solomon\'s local Japanese branch, STNJ. Possessing powerful pyrokinetic abilities, she is herself a Witch, putting her at odds with STNJ\'s methods of dealing with rogue Witches. In particular, Robin opposes the use of an elixir called Orbo, which can weaken or even neutralize a Witch\'s powers. If Robin wants to find her place within the organization, she must find a way to navigate the internal politics of Solomon while also handling the threat of hostile Witches—but both seem to be dangerous for very different reasons.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:08'),
(4, 5, 'Cowboy Bebop: Tengoku no Tobira', 'https://myanimelist.net/images/anime/1439/93480.jpg', 'Another day, another bounty—such is the life of the often unlucky crew of the Bebop. However, this routine is interrupted when Faye, who is chasing a fairly worthless target on Mars, witnesses an oil tanker suddenly explode, causing mass hysteria. As casualties mount due to a strange disease spreading through the smoke from the blast, a whopping three hundred million woolong price is placed on the head of the supposed perpetrator.\n\nWith lives at stake and a solution to their money problems in sight, the Bebop crew springs into action. Spike, Jet, Faye, and Edward, followed closely by Ein, split up to pursue different leads across Alba City. Through their individual investigations, they discover a cover-up scheme involving a pharmaceutical company, revealing a plot that reaches much further than the ragtag team of bounty hunters could have realized.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(5, 22, 'Tennis no Oujisama', 'https://myanimelist.net/images/anime/6/21624.jpg', 'At the request of his father, tennis prodigy Ryouma Echizen has returned from America and is ready to take the Japanese tennis scene by storm. Aiming to become the best tennis player in the country, he enrolls in Seishun Academy—home to one of the best middle school tennis teams in Japan. \n\nAfter Ryouma catches the captain\'s eye, he finds himself playing for a spot on the starting lineup in the intra-school ranking matches despite only being a freshman. Due to his age, the rest of the Seishun Boys\' Tennis Team are initially reluctant to accept him, but his skill and determination convinces them to let him in.\n\nArmed with their new \"super rookie,\" Seishun sets out to claim a spot in the National Tournament, hoping to take the coveted title for themselves. In order to do so, the team must qualify by playing through the Tokyo Prefectural and Kanto Regionals. Yet, the road ahead of them is shared by a plethora of strong schools, each playing tennis in unique ways for their own reasons. Ryouma and his teammates must learn to cooperate if they want to become the champions they aspire to be.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(6, 6, 'Trigun', 'https://myanimelist.net/images/anime/1130/120002.jpg', 'Vash the Stampede is the man with a $$60,000,000,000 bounty on his head. The reason: he\'s a merciless villain who lays waste to all those that oppose him and flattens entire cities for fun, garnering him the title \"The Humanoid Typhoon.\" He leaves a trail of death and destruction wherever he goes, and anyone can count themselves dead if they so much as make eye contact—or so the rumors say. In actuality, Vash is a huge softie who claims to have never taken a life and avoids violence at all costs.\n\nWith his crazy doughnut obsession and buffoonish attitude in tow, Vash traverses the wasteland of the planet Gunsmoke, all the while followed by two insurance agents, Meryl Stryfe and Milly Thompson, who attempt to minimize his impact on the public. But soon, their misadventures evolve into life-or-death situations as a group of legendary assassins are summoned to bring about suffering to the trio. Vash\'s agonizing past will be unraveled and his morality and principles pushed to the breaking point.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(7, 1, 'Cowboy Bebop', 'https://myanimelist.net/images/anime/4/19644.jpg', 'Crime is timeless. By the year 2071, humanity has expanded across the galaxy, filling the surface of other planets with settlements like those on Earth. These new societies are plagued by murder, drug use, and theft, and intergalactic outlaws are hunted by a growing number of tough bounty hunters.\n\nSpike Spiegel and Jet Black pursue criminals throughout space to make a humble living. Beneath his goofy and aloof demeanor, Spike is haunted by the weight of his violent past. Meanwhile, Jet manages his own troubled memories while taking care of Spike and the Bebop, their ship. The duo is joined by the beautiful con artist Faye Valentine, odd child Edward Wong Hau Pepelu Tivrusky IV, and Ein, a bioengineered Welsh corgi.\n\nWhile developing bonds and working to catch a colorful cast of criminals, the Bebop crew\'s lives are disrupted by a menace from Spike\'s past. As a rival\'s maniacal plot continues to unravel, Spike must choose between life with his newfound family or revenge for his old wounds.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:08'),
(8, 33, 'Kenpuu Denki Berserk', 'https://myanimelist.net/images/anime/1384/119988.jpg', 'Guts, a man who will one day be known as the Black Swordsman, is a young traveling mercenary characterized by the large greatsword he carries. He accepts jobs that offer the most money, but he never stays with one group for long—until he encounters the Band of the Falcon. Ambushed after completing a job, Guts crushes many of its members in combat. Griffith, The Band of the Falcon\'s leader and founder, takes an interest in Guts and duels him. While the others are no match for Guts, Griffith defeats him in one blow.\n\nIncapacitated and taken into the Band of the Falcon\'s camp to recover, Guts wakes up two days later. He confronts Griffith, and the two duel yet again, only this time with a condition: Guts will join the Band of the Falcon if he loses. Due to his fresh injuries, Guts loses the fight and is inducted by Griffith.\n\nIn three years\' time, Guts has become one of the Band of the Falcon\'s commanders. On the battlefield, his combat prowess is second only to Griffith as he takes on large groups of enemies all on his own. With Guts\' immense strength and Griffith\'s leadership, the Band of the Falcon dominate every battle they partake in. But something menacing lurks in the shadows, threatening to change Guts\' life forever.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:08'),
(9, 18, 'Initial D Fourth Stage', 'https://myanimelist.net/images/anime/9/10521.jpg', 'Takumi Fujiwara finally joins Ryousuke and Keisuke Takahashi to create \"Project D.\" Their goal is twofold: Ryousuke wants to develop his \"High-Speed Street Racing Theory,\" while Keisuke and Takumi aim at improving their driving skills by facing powerful opponents on dangerous roads. The idea of Project D is to challenge street racing teams from other prefectures to improve both their uphill and downhill records. In order to attract the attention of the best racing teams, Ryousuke creates a dedicated website to announce the future battles of Project D and post the team\'s results.\n\nThe fourth season of Initial D details the hardships and successes of the members of Project D as they try to become the best street racing team outside of Gunma Prefecture.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(10, 32, 'Shinseiki Evangelion Movie: Air/Magokoro wo, Kimi ni', 'https://myanimelist.net/images/anime/1404/98182.jpg', 'Shinji Ikari is left emotionally comatose after the death of a dear friend. With his son mentally unable to pilot the humanoid robot Evangelion Unit-01, Gendou Ikari\'s NERV races against the shadow organization SEELE to see who can enact their ultimate plan first. SEELE desires to create a godlike being by fusing their own souls into an Evangelion unit, while Gendou wishes to revert all of humanity into one primordial being so that he can be reunited with Yui, his deceased wife.\n\nSEELE unleashes its military forces in a lethal invasion of NERV headquarters. As SEELE\'s forces cut down NERV\'s scientists and security personnel, Asuka Langley Souryuu pilots Evangelion Unit-02 in a desperate last stand against SEELE\'s heaviest weaponry.\n\nThe battle rages on, and a depressed Shinji hides deep within NERV\'s headquarters. With the fate of the world resting in Shinji\'s hands, Captain Misato Katsuragi hunts for the teenage boy as society crumbles around them.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(11, 26, 'Texhnolyze', 'https://myanimelist.net/images/anime/1027/131977.jpg', 'In the dark underground city of Lux, people live in fear and despair under the rule of various criminal factions. Almost secluded from the surface, the gangs\' only interaction with the outer world is their mining operation of \"raffia,\" which is the raison d\'être of the city.\n\nAvailable only in Lux, this rare substance is the basis of \"texhnolyze\" transplants that permit humans to replace parts of their body with cybernetic prostheses. The latter have the particularity not to trigger an immune response in their hosts and the \"Class\" has the privilege to conduct research on them. This elusive organization, also in charge of the raffia production, delegates its executive authority to a group called Organo led by Keigo Oonishi—a self-righteous man with texhnolyzed legs who is rumored to hear the \"voice of the city.\"\n\nThe fragile balance of powers in Lux is disturbed when a mysterious visitor named Kazuho Yoshii begins committing a series of crimes that puts the gangs at each other\'s throats. In the midst of the chaos, new actors emerge: Ichise, an ex-boxer mutilated by Organo and recently texhnolyzed by Eriko \"Doc\" Kamata; and Ran, a young florist who can see the future. While Lux steadily plunges into insanity, both Ichise and Ran find themselves involved in the greatest crisis the city has ever faced.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(12, 30, 'Shinseiki Evangelion', 'https://myanimelist.net/images/anime/1314/108941.jpg', 'Fifteen years after a cataclysmic event known as the Second Impact, the world faces a new threat: monstrous celestial beings called Angels invade Tokyo-3 one by one. Mankind is unable to defend themselves against the Angels despite utilizing their most advanced munitions and military tactics. The only hope for human salvation rests in the hands of NERV, a mysterious organization led by the cold Gendou Ikari. NERV operates giant humanoid robots dubbed \"Evangelions\" to combat the Angels with state-of-the-art advanced weaponry and protective barriers known as Absolute Terror Fields.\n\nYears after being abandoned by his father, Shinji Ikari, Gendou\'s 14-year-old son, returns to Tokyo-3. Shinji undergoes a perpetual internal battle against the deeply buried trauma caused by the loss of his mother and the emotional neglect he suffered at the hands of his father. Terrified to open himself up to another, Shinji\'s life is forever changed upon meeting 29-year-old Misato Katsuragi, a high-ranking NERV officer who shows him a free-spirited maternal kindness he has never experienced.\n\nA devastating Angel attack forces Shinji into action as Gendou reveals his true motive for inviting his son back to Tokyo-3: Shinji is the only child capable of efficiently piloting Evangelion Unit-01, a new robot that synchronizes with his biometrics. Despite the brutal psychological trauma brought about by piloting an Evangelion, Shinji defends Tokyo-3 against the angelic threat, oblivious to his father\'s dark machinations.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:08'),
(13, 24, 'School Rumble', 'https://myanimelist.net/images/anime/1465/142014.jpg', 'Just the words \"I love you,\" and everything changes—such is the nature of the bittersweet trials of high school romance. Tenma Tsukamoto, a second year, is on a quest to confess her feelings to the boy she likes. Kenji Harima, a delinquent with a sizable reputation, is in a similar situation, as he cannot properly convey his feelings to the one he loves. Between school, friends, rivalries, and hobbies, these two will find that high school romance is no walk in the park, especially as misunderstandings further complicate their plight.\n\nSchool Rumble is a high-octane romantic comedy full of relatable situations, as Tenma and Kenji both try to win the hearts of those they desire.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(14, 25, 'Sunabouzu', 'https://myanimelist.net/images/anime/6/75536.jpg', 'The Great Kanto Desert, a sweltering wasteland of nothing but ruins and sand, is all that remains of post-apocalyptic Japan. The once fair population has been left to cling to the inhospitable dunes for survival. At least, that is the case for normal people. For those who have spent a little too long in the Kanto sun, the desert offers a wondrous opportunity to make a name for themselves.\n\nOne such person is the masked handyman \"Sunabouzu,\" or Desert Punk, who has forged a legendary reputation for always finishing his jobs, no matter the nature or cost. Cunning and ruthless, he has become a force of crude destruction to the other desert people. However, the \"Vixen of the Desert,\" Junko Asagiri, discovers that Sunabouzu is not without his weaknesses—he is easily swayed by his insatiable lust for large-breasted desert babes. \n\nFollowing their chaotic adventures through the Kanto Desert, Sunabouzu features a bizarre cast of personalities who entertain themselves with senseless violence and perversion in a world long destroyed by their forefathers. And just like them, they have not learned a damn thing.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(15, 23, 'Ring ni Kakero 1', 'https://myanimelist.net/images/anime/1121/149685.jpg', 'In order to fulfill their dead father\'s wish, the siblings Takane Kiku and Takane Ryuji aim for the champion title of the boxing arena. Their sister, Kiku, will act as the trainer while her brother, Ryuji, will concentrate on the role of the boxer and learn the Boomerang. His battle with many rivals has led to the growth and maturing of Ryuji. The junior high boxing tournament has begun and Ryuji will be fighting his arch-rival, Kenzaki Jun. The battle begins.\n\n(Source: ANN)', '2026-04-21 16:39:09'),
(16, 15, 'Eyeshield 21', 'https://myanimelist.net/images/anime/1079/133529.jpg', 'Shy, reserved, and small-statured, Deimon High School student Sena Kobayakawa is the perfect target for bullies. However, as a result of running errands throughout his life, Sena has become agile and developed a skill for avoiding crowds of people. After the cunning Youichi Hiruma—captain of the Deimon Devil Bats football team—witnesses Sena\'s rapid legs in motion, he coerces the timid boy into joining his squad.\n\nAs Hiruma wants to conceal Sena\'s identity from other clubs, Sena is forced to hide under the visored helmet of \"Eyeshield 21,\" a mysterious running back wearing the number 21 jersey. The legendary Eyeshield 21 can supposedly run at the speed of light and has achieved remarkable feats in the United States during his time at the Notre Dame College.\n\nAccustomed to avoiding his problems in the past, Sena\'s specialty might just help him become the new secret weapon of the Deimon Devil Bats. As he interacts with his teammates, Sena gradually gains more self-confidence and forges valuable bonds along the way.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(17, 27, 'Trinity Blood', 'https://myanimelist.net/images/anime/10/24649.jpg', 'Following Armageddon, an apocalyptic war, mankind faces yet another menace: vampires. The continuous confrontations between the races have split the world into separate factions. The race of vampires, Methuselah, are affiliated with the New Human Empire; whereas the humans, deemed Terrans by the vampires, make up the Vatican Papal State. Furthermore, extremist groups like the Rosenkreuz Order strive to rekindle a war, despite the factions\' attempts to avoid direct conflict.\n\nTo combat terrorist organizations, the Vatican has implemented the AX unit. Led by Cardinal Caterina Sforza, the AX agents investigate vampire-related disturbances with hopes that the Terrans and the Methuselah will one day achieve peaceful coexistence. Amongst the AX unit is priest Abel Nightroad—a seemingly disoriented but gentle-hearted fellow who is a fierce vampire slayer on the battlefield. Joining the unit as his partner is agent Sister Esther Blanchett, a brave and gentle young nun troubled with a tragic past. \n\nAs the two grow closer, they begin to uncover signs of malicious schemes and dark forces working in the shadows. But the path they walk is riddled with misfortune that might just force them to confront the memories that plague their hearts.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(18, 43, 'Koukaku Kidoutai', 'https://myanimelist.net/images/anime/10/82594.jpg', 'In the year 2029, Niihama City has become a technologically advanced metropolis. Due to great improvements in cybernetics, its citizens are able to replace their limbs with robotic parts. The world is now more interconnected than ever before, and the city\'s Public Security Section 9 is responsible for combating corruption, terrorism, and other dangerous threats following this shift toward globalization.\n\nThe strong-willed Major Motoko Kusanagi of Section 9 spearheads a case involving a mysterious hacker known only as the \"Puppet Master,\" who leaves a trail of victims stripped of their memories. Like many in this futuristic world, the Puppet Master\'s body is almost entirely robotic, giving them incredible power.\n\nAs Motoko and her subordinates follow the enigmatic criminal\'s trail, other parties—including Section 6—start to get involved, forcing her to confront the extremely complicated nature of the case. Pondering about various philosophical questions, such as her own life\'s meaning, Motoko soon realizes that the one who will provide these answers is none other than the Puppet Master themself.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(19, 20, 'Naruto', 'https://myanimelist.net/images/anime/1141/142503.jpg', 'Twelve years ago, a colossal demon fox terrorized the world. During the monster\'s attack on the Hidden Leaf Village, the Hokage—the village\'s leader and most powerful ninja—sacrifices himself to seal the beast inside a newborn, relieving civilization from destruction while dooming the baby to a lonely life.\n\nNow, after years of being shunned and bullied, Naruto Uzumaki pesters the village with elaborate pranks and vandalism. Despite these antics, he works hard to achieve his dream: to become the Hokage and earn the acknowledgement of those who have mistreated him for his entire life. Naruto joins Team 7, a ninja squad made up of two of his peers—prodigy Sasuke Uchiha and clever Sakura Haruno.\n\nUnder the aloof Kakashi Hatake\'s leadership, Team 7 takes on a series of difficult missions, forcing its members to grow in strength and comradery despite their many differences. Naruto strives to stand out in his rivalry with Sasuke and earn the romantic affection of Sakura. But as the trio brush against danger and death, their tragic pasts threaten to tear them apart.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(20, 19, 'Monster', 'https://myanimelist.net/images/anime/10/18793.jpg', 'Dr. Kenzou Tenma, an elite neurosurgeon recently engaged to his hospital director\'s daughter, is well on his way to ascending the hospital hierarchy. That is until one night, a seemingly small event changes Dr. Tenma\'s life forever. While preparing to perform surgery on someone, he gets a call from the hospital director telling him to switch patients and instead perform life-saving brain surgery on a famous performer. His fellow doctors, fiancée, and the hospital director applaud his accomplishment; but because of the switch, a poor immigrant worker is dead, causing Dr. Tenma to have a crisis of conscience.\n\nSo when a similar situation arises, Dr. Tenma stands his ground and chooses to perform surgery on the young boy Johan Liebert instead of the town\'s mayor. Unfortunately, this choice leads to serious ramifications for Dr. Tenma—losing his social standing being one of them. However, with the mysterious death of the director and two other doctors, Dr. Tenma\'s position is restored. With no evidence to convict him, he is released and goes on to attain the position of hospital director. \n\nNine years later when Dr. Tenma saves the life of a criminal, his past comes back to haunt him—once again, he comes face to face with the monster he operated on. He must now embark on a quest of pursuit to make amends for the havoc spread by the one he saved.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(21, 21, 'One Piece', 'https://myanimelist.net/images/anime/1244/138851.jpg', 'Barely surviving in a barrel after passing through a terrible whirlpool at sea, carefree Monkey D. Luffy ends up aboard a ship under attack by fearsome pirates. Despite being a naive-looking teenager, he is not to be underestimated. Unmatched in battle, Luffy is a pirate himself who resolutely pursues the coveted One Piece treasure and the King of the Pirates title that comes with it.\n\nThe late King of the Pirates, Gol D. Roger, stirred up the world before his death by disclosing the whereabouts of his hoard of riches and daring everyone to obtain it. Ever since then, countless powerful pirates have sailed dangerous seas for the prized One Piece only to never return. Although Luffy lacks a crew and a proper ship, he is endowed with a superhuman ability and an unbreakable spirit that make him not only a formidable adversary but also an inspiration to many.\n\nAs he faces numerous challenges with a big smile on his face, Luffy gathers one-of-a-kind companions to join him in his ambitious endeavor, together embracing perils and wonders on their once-in-a-lifetime adventure.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(22, 17, 'Hungry Heart: Wild Striker', 'https://myanimelist.net/images/anime/12/49655.jpg', 'As the younger brother of Japanese soccer star Seisuke Kanou, Kyousuke was always expected to grow as a soccer player at the same pace his brother did—an expectation that proved too difficult to meet. Having fallen behind, he now lives in the shadow of his brother\'s success.\n\nEntering his freshman year at Jouyou Akanegaoka High School, Kyousuke vows never to play soccer again. However, Miki Tsujiwaki, the captain of the girls\' soccer team, and Mori Kazuto, the manager of the boys\' team, recognize Kyousuke\'s potential and want to see his return to the game for their own reasons.\n\nWith an opportunity to play soccer again, Kyousuke must either remain steadfast in his decision to abandon the sport he once loved, or allow himself to reignite that flame to become the best striker in the world.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(23, 28, 'Yakitate!! Japan', 'https://myanimelist.net/images/anime/3/76432.jpg', 'While countries such as France, England, and Germany all have their own internationally celebrated bread, Japan simply does not have one that can match in reputation.\n\nThus after discovering the wonders of breadmaking at a young age, Kazuma Azuma embarks on a quest to create Japan\'s own unique national bread. And being blessed with unusually warm hands that allow dough to ferment faster, Azuma is able to bring his baking innovations to another level.\n\nAs he begins working at the prestigious Japanese bakery chain, Pantasia, Azuma encounters other talented bakers and experiences firsthand the competitive world of baking. Along with his newfound friends and rivals, Azuma strives to create new and unparalleled bread that will start a baking revolution. \n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(24, 16, 'Hachimitsu to Clover', 'https://myanimelist.net/images/anime/1301/133577.jpg', 'Yuuta Takemoto, a sophomore at an arts college, shares a cheap apartment with two seniors—the eccentric Shinobu Morita, who keeps failing to graduate due to his absenteeism, and the sensible Takumi Mayama, who acts as a proper senior to Takemoto, often looking out for him.\n\nTakemoto had not given much thought to his future until one fine spring day, when he meets the endearing Hagumi Hanamoto and falls in love at first sight. Incredibly gifted in the arts, Hagumi enrolls in Takemoto\'s university and soon befriends the popular pottery student Ayumi Yamada. Ayumi is already well acquainted with the three flatmates and secretly harbors deep feelings for one of them.\n\nHachimitsu to Clover is a heartwarming tale of youth, love, soul-searching, and self-discovery, intricately woven through the complex relationships between five dear friends.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(25, 31, 'Shinseiki Evangelion Movie: Shi to Shinsei', 'https://myanimelist.net/images/anime/1993/113122.jpg', 'In the year 2015, more than a decade has passed since the catastrophic event known as Second Impact befell mankind. During this time of recovery, a select few learned of beings known as the Angels—colossal malevolent entities with the intention of triggering the Third Impact and wiping out the rest of humanity.\n\nCalled into the city of Tokyo-3 by his father Gendou Ikari, teenager Shinji is thrust headlong into humanity\'s struggle. Separated from Gendou since the death of his mother, Shinji presumes that his father wishes to repair their shattered familial bonds; instead, he discovers that he was brought to pilot a giant machine capable of fighting the Angels, Evangelion Unit-01. Forced to battle against wave after wave of mankind\'s greatest threat, the young boy finds himself caught in the middle of a plan that could affect the future of humanity forever.\n\n[Written by MAL Rewrite]', '2026-04-21 16:39:09'),
(26, 2, 'Bouken Ou Beet', 'https://myanimelist.net/images/anime/7/21569.jpg', 'It is the dark century and the people are suffering under the rule of the devil, Vandel, who is able to manipulate monsters. The Vandel Busters are a group of people who hunt these devils, and among them, the Zenon Squad is known to be the strongest busters on the continent. A young boy, Beet, dreams of joining the Zenon Squad. However, one day, as a result of Beet\'s fault, the Zenon squad was defeated by the devil, Beltose. The five dying busters sacrificed their life power into their five weapons, Saiga. After giving their weapons to Beet, they passed away. Years have passed since then and the young Vandel Buster, Beet, begins his adventure to carry out the Zenon Squad\'s will to put an end to the dark century.', '2026-04-22 19:03:15'),
(27, 999, 'Sousou no Frieren', 'https://myanimelist.net/images/anime/1015/138006.jpg', 'After defeating the Demon King, the hero party disbands and each member goes their separate way. Frieren, an elven mage with an almost endless lifespan, watches her former companions age and pass away while she remains unchanged. Regretting that she never truly understood their feelings, she begins a journey to learn about humans, emotions, and what it means to live. Joined by new allies, Frieren faces magical and personal challenges as she tries to honor the memory of those she once traveled with.', '2026-04-24 23:22:00'),
(28, 1000, 'Dragon Ball', 'https://myanimelist.net/images/anime/1887/92364.jpg', 'Goku, a young boy with a monkey tail and extraordinary strength, lives alone in the mountains until he meets Bulma, a girl searching for the legendary Dragon Balls. Together they embark on an adventure filled with martial arts, humor, and strange enemies. As Goku trains and grows stronger, he faces tournaments, villains, and challenges that push him toward becoming one of the greatest fighters in the world.', '2026-04-24 23:22:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `anime_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comments`
--

INSERT INTO `comments` (`id`, `anime_id`, `user_id`, `content`, `rating`, `created_at`) VALUES
(8, 27, 1, 'El mejor anime del mundo', 5, '2026-04-30 07:22:11'),
(9, 21, 1, 'Una gran historia', 5, '2026-04-30 07:22:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_anime_status`
--

CREATE TABLE `user_anime_status` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `anime_id` int(11) NOT NULL,
  `status` enum('visto','deseado','en_proceso') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `link` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `descripcion` varchar(250) DEFAULT NULL,
  `theme` varchar(10) DEFAULT 'light'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `link`, `password`, `avatar`, `descripcion`, `theme`) VALUES
(1, 'admin', '@admin', '$2y$10$A87FwQv9DtUFlvEnvS7LUuxZLJXCcZtaRUlV0eHj2D0.JRi3O1sdm', '1777468473_mirucerrada.png', 'Hola, soy Miru', 'dark');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `animes`
--
ALTER TABLE `animes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_id` (`api_id`);

--
-- Indices de la tabla `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comments_anime` (`anime_id`),
  ADD KEY `fk_comments_user` (`user_id`);

--
-- Indices de la tabla `user_anime_status`
--
ALTER TABLE `user_anime_status`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`anime_id`),
  ADD KEY `anime_id` (`anime_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `animes`
--
ALTER TABLE `animes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `user_anime_status`
--
ALTER TABLE `user_anime_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_user` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_anime_status`
--
ALTER TABLE `user_anime_status`
  ADD CONSTRAINT `user_anime_status_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_anime_status_ibfk_2` FOREIGN KEY (`anime_id`) REFERENCES `animes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
