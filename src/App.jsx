import React, { useState, useEffect } from 'react';
import ttsService from './services/tts';
import { mathsQuestions, mathsCategories } from './data/mathsQuestions';
import { scienceQuestions, scienceCategories } from './data/scienceQuestions';
import { historyQuestions, historyCategories } from './data/historyQuestions';
import { assessmentQuestions, shouldShowAssessment } from './data/assessmentQuestions';
import aiMarkingService from './services/aiMarking';
import { CONFIG } from './config';
import EnglishReportDashboard from './components/dashboard/EnglishReportDashboard';
import MathsReportDashboard from './components/dashboard/MathsReportDashboard';
import ScienceReportDashboard from './components/dashboard/ScienceReportDashboard';
import HistoryReportDashboard from './components/dashboard/HistoryReportDashboard';

// ============ MASSIVE WORD LIST (160+ words) ============
const allWords = [
  // ===== TRICKY WORDS (20) =====
  { id: 1, word: 'because', sentence: 'I stayed home due to the rain.', category: 'tricky', difficulty: 'medium' },
  { id: 2, word: 'said', sentence: 'She told me earlier.', category: 'tricky', difficulty: 'easy' },
  { id: 3, word: 'could', sentence: 'Maybe I can help.', category: 'tricky', difficulty: 'easy' },
  { id: 4, word: 'would', sentence: 'I wish you had come.', category: 'tricky', difficulty: 'easy' },
  { id: 5, word: 'should', sentence: 'You ought to try it.', category: 'tricky', difficulty: 'easy' },
  { id: 6, word: 'people', sentence: 'Many humans were there.', category: 'tricky', difficulty: 'medium' },
  { id: 7, word: 'answer', sentence: 'Can you reply to this?', category: 'tricky', difficulty: 'medium' },
  { id: 8, word: 'busy', sentence: 'I have lots to do.', category: 'tricky', difficulty: 'easy' },
  { id: 9, word: 'beautiful', sentence: 'The view was lovely.', category: 'tricky', difficulty: 'hard' },
  { id: 10, word: 'again', sentence: 'Do it once more.', category: 'tricky', difficulty: 'easy' },
  { id: 11, word: 'enough', sentence: 'I have plenty now.', category: 'tricky', difficulty: 'medium' },
  { id: 12, word: 'through', sentence: 'Walk from one side to the other.', category: 'tricky', difficulty: 'hard' },
  { id: 13, word: 'thought', sentence: 'I had an idea.', category: 'tricky', difficulty: 'medium' },
  { id: 14, word: 'brought', sentence: 'I carried it here.', category: 'tricky', difficulty: 'medium' },
  { id: 15, word: 'caught', sentence: 'I grabbed the ball.', category: 'tricky', difficulty: 'medium' },
  { id: 16, word: 'taught', sentence: 'Someone showed me how.', category: 'tricky', difficulty: 'medium' },
  { id: 17, word: 'although', sentence: 'Even so, I tried.', category: 'tricky', difficulty: 'hard' },
  { id: 18, word: 'favourite', sentence: 'This is the one I like best.', category: 'tricky', difficulty: 'medium' },
  { id: 19, word: 'surprise', sentence: 'I did not expect that!', category: 'tricky', difficulty: 'medium' },
  { id: 20, word: 'library', sentence: 'A place full of books.', category: 'tricky', difficulty: 'medium' },

  // ===== I BEFORE E (15) =====
  { id: 21, word: 'friend', sentence: "She is my best pal.", category: 'i-before-e', difficulty: 'easy' },
  { id: 22, word: 'believe', sentence: 'I think it will work out.', category: 'i-before-e', difficulty: 'medium' },
  { id: 23, word: 'receive', sentence: 'Did you get my message?', category: 'i-before-e', difficulty: 'hard' },
  { id: 24, word: 'piece', sentence: 'Can I have a slice?', category: 'i-before-e', difficulty: 'medium' },
  { id: 25, word: 'achieve', sentence: 'You can reach your goals.', category: 'i-before-e', difficulty: 'hard' },
  { id: 26, word: 'weird', sentence: 'That was very strange.', category: 'i-before-e', difficulty: 'medium' },
  { id: 27, word: 'neighbour', sentence: 'The person next door.', category: 'i-before-e', difficulty: 'hard' },
  { id: 28, word: 'either', sentence: 'Pick one or the other.', category: 'i-before-e', difficulty: 'medium' },
  { id: 29, word: 'ceiling', sentence: 'Look up at the top.', category: 'i-before-e', difficulty: 'medium' },
  { id: 30, word: 'field', sentence: 'The cows were in the grass.', category: 'i-before-e', difficulty: 'easy' },
  { id: 31, word: 'shield', sentence: 'The knight held it for protection.', category: 'i-before-e', difficulty: 'medium' },
  { id: 32, word: 'thief', sentence: 'Someone who steals things.', category: 'i-before-e', difficulty: 'medium' },
  { id: 33, word: 'chief', sentence: 'The leader of the group.', category: 'i-before-e', difficulty: 'medium' },
  { id: 34, word: 'relief', sentence: 'I felt so much better.', category: 'i-before-e', difficulty: 'medium' },
  { id: 35, word: 'niece', sentence: 'My sister has a daughter.', category: 'i-before-e', difficulty: 'medium' },

  // ===== SOFT C (15) =====
  { id: 36, word: 'decide', sentence: 'I cannot choose what to wear.', category: 'soft-c', difficulty: 'medium' },
  { id: 37, word: 'certain', sentence: 'I am absolutely sure about it.', category: 'soft-c', difficulty: 'hard' },
  { id: 38, word: 'accident', sentence: 'The crash happened this morning.', category: 'soft-c', difficulty: 'hard' },
  { id: 39, word: 'circle', sentence: 'Draw a round shape.', category: 'soft-c', difficulty: 'medium' },
  { id: 40, word: 'celebrate', sentence: 'Let us have a party!', category: 'soft-c', difficulty: 'hard' },
  { id: 41, word: 'necessary', sentence: 'You need to do this.', category: 'soft-c', difficulty: 'hard' },
  { id: 42, word: 'notice', sentence: 'Did you spot it?', category: 'soft-c', difficulty: 'medium' },
  { id: 43, word: 'special', sentence: 'This is really important.', category: 'soft-c', difficulty: 'medium' },
  { id: 44, word: 'medicine', sentence: 'Take this to feel better.', category: 'soft-c', difficulty: 'hard' },
  { id: 45, word: 'exercise', sentence: 'Running keeps you fit.', category: 'soft-c', difficulty: 'hard' },
  { id: 46, word: 'science', sentence: 'We learn about nature.', category: 'soft-c', difficulty: 'medium' },
  { id: 47, word: 'experience', sentence: 'I have done this before.', category: 'soft-c', difficulty: 'hard' },
  { id: 48, word: 'difference', sentence: 'Can you spot what changed?', category: 'soft-c', difficulty: 'hard' },
  { id: 49, word: 'sentence', sentence: 'A group of words together.', category: 'soft-c', difficulty: 'medium' },
  { id: 50, word: 'peace', sentence: 'Calm and quiet everywhere.', category: 'soft-c', difficulty: 'medium' },

  // ===== DOUBLE LETTERS (18) =====
  { id: 51, word: 'different', sentence: 'This one is not the same.', category: 'double-letters', difficulty: 'medium' },
  { id: 52, word: 'beginning', sentence: 'This is just the start.', category: 'double-letters', difficulty: 'hard' },
  { id: 53, word: 'running', sentence: 'She was moving fast.', category: 'double-letters', difficulty: 'easy' },
  { id: 54, word: 'swimming', sentence: 'I love the pool.', category: 'double-letters', difficulty: 'medium' },
  { id: 55, word: 'happened', sentence: 'It occurred yesterday.', category: 'double-letters', difficulty: 'medium' },
  { id: 56, word: 'embarrass', sentence: 'Do not make me feel awkward.', category: 'double-letters', difficulty: 'hard' },
  { id: 57, word: 'committee', sentence: 'The group made a choice.', category: 'double-letters', difficulty: 'hard' },
  { id: 58, word: 'address', sentence: 'Where do you live?', category: 'double-letters', difficulty: 'medium' },
  { id: 59, word: 'immediately', sentence: 'Do it right now.', category: 'double-letters', difficulty: 'hard' },
  { id: 60, word: 'occasion', sentence: 'A special event or time.', category: 'double-letters', difficulty: 'hard' },
  { id: 61, word: 'success', sentence: 'You did really well!', category: 'double-letters', difficulty: 'medium' },
  { id: 62, word: 'possible', sentence: 'It might happen.', category: 'double-letters', difficulty: 'medium' },
  { id: 63, word: 'tomorrow', sentence: 'The day after today.', category: 'double-letters', difficulty: 'medium' },
  { id: 64, word: 'follow', sentence: 'Come along behind me.', category: 'double-letters', difficulty: 'easy' },
  { id: 65, word: 'recommend', sentence: 'I suggest you try this.', category: 'double-letters', difficulty: 'hard' },
  { id: 66, word: 'connect', sentence: 'Join these two together.', category: 'double-letters', difficulty: 'medium' },
  { id: 67, word: 'appear', sentence: 'Suddenly it showed up.', category: 'double-letters', difficulty: 'medium' },
  { id: 68, word: 'sudden', sentence: 'It was very quick.', category: 'double-letters', difficulty: 'easy' },

  // ===== SILENT LETTERS (18) =====
  { id: 69, word: 'knight', sentence: 'The warrior rode a horse.', category: 'silent-letters', difficulty: 'medium' },
  { id: 70, word: 'knife', sentence: 'Cut it with the blade.', category: 'silent-letters', difficulty: 'easy' },
  { id: 71, word: 'write', sentence: 'Put pen to paper.', category: 'silent-letters', difficulty: 'easy' },
  { id: 72, word: 'island', sentence: 'The land surrounded by water.', category: 'silent-letters', difficulty: 'medium' },
  { id: 73, word: 'castle', sentence: 'The king lived there.', category: 'silent-letters', difficulty: 'medium' },
  { id: 74, word: 'rhythm', sentence: 'The beat of the music.', category: 'silent-letters', difficulty: 'hard' },
  { id: 75, word: 'scissors', sentence: 'Use them to cut paper.', category: 'silent-letters', difficulty: 'medium' },
  { id: 76, word: 'climb', sentence: 'Go up the ladder.', category: 'silent-letters', difficulty: 'easy' },
  { id: 77, word: 'doubt', sentence: 'I am not sure.', category: 'silent-letters', difficulty: 'medium' },
  { id: 78, word: 'listen', sentence: 'Pay attention to this.', category: 'silent-letters', difficulty: 'easy' },
  { id: 79, word: 'honest', sentence: 'Always tell the truth.', category: 'silent-letters', difficulty: 'medium' },
  { id: 80, word: 'hour', sentence: 'Sixty minutes long.', category: 'silent-letters', difficulty: 'easy' },
  { id: 81, word: 'know', sentence: 'I understand this.', category: 'silent-letters', difficulty: 'easy' },
  { id: 82, word: 'knock', sentence: 'Tap on the door.', category: 'silent-letters', difficulty: 'easy' },
  { id: 83, word: 'wrong', sentence: 'That is not correct.', category: 'silent-letters', difficulty: 'easy' },
  { id: 84, word: 'wreck', sentence: 'The ship was destroyed.', category: 'silent-letters', difficulty: 'medium' },
  { id: 85, word: 'thumb', sentence: 'The short finger.', category: 'silent-letters', difficulty: 'easy' },
  { id: 86, word: 'comb', sentence: 'Use it on your hair.', category: 'silent-letters', difficulty: 'easy' },

  // ===== ENDINGS -TION/-SION/-OUS (15) =====
  { id: 87, word: 'station', sentence: 'Wait at the platform.', category: 'endings', difficulty: 'medium' },
  { id: 88, word: 'mention', sentence: 'Did you talk about it?', category: 'endings', difficulty: 'medium' },
  { id: 89, word: 'question', sentence: 'Can I ask something?', category: 'endings', difficulty: 'medium' },
  { id: 90, word: 'direction', sentence: 'Which way should I go?', category: 'endings', difficulty: 'hard' },
  { id: 91, word: 'decision', sentence: 'What did you pick?', category: 'endings', difficulty: 'hard' },
  { id: 92, word: 'famous', sentence: 'Everyone knows them.', category: 'endings', difficulty: 'medium' },
  { id: 93, word: 'dangerous', sentence: 'This is not safe.', category: 'endings', difficulty: 'hard' },
  { id: 94, word: 'serious', sentence: 'This is very important.', category: 'endings', difficulty: 'hard' },
  { id: 95, word: 'information', sentence: 'Facts and details.', category: 'endings', difficulty: 'hard' },
  { id: 96, word: 'education', sentence: 'Learning at school.', category: 'endings', difficulty: 'hard' },
  { id: 97, word: 'television', sentence: 'Watch shows on the screen.', category: 'endings', difficulty: 'hard' },
  { id: 98, word: 'nervous', sentence: 'Feeling a bit scared.', category: 'endings', difficulty: 'medium' },
  { id: 99, word: 'generous', sentence: 'Kind and giving.', category: 'endings', difficulty: 'hard' },
  { id: 100, word: 'curious', sentence: 'Wanting to know more.', category: 'endings', difficulty: 'medium' },
  { id: 101, word: 'jealous', sentence: 'Wanting what others have.', category: 'endings', difficulty: 'hard' },

  // ===== HOMOPHONES (18) =====
  { id: 102, word: 'their', sentence: 'It belongs to them.', category: 'homophones', difficulty: 'medium' },
  { id: 103, word: 'there', sentence: 'Look over in that place.', category: 'homophones', difficulty: 'medium' },
  { id: 104, word: 'hear', sentence: 'Use your ears to listen.', category: 'homophones', difficulty: 'easy' },
  { id: 105, word: 'here', sentence: 'Come to this spot.', category: 'homophones', difficulty: 'easy' },
  { id: 106, word: 'where', sentence: 'In what place?', category: 'homophones', difficulty: 'easy' },
  { id: 107, word: 'wear', sentence: 'Put on your clothes.', category: 'homophones', difficulty: 'easy' },
  { id: 108, word: 'weather', sentence: 'Is it sunny or rainy?', category: 'homophones', difficulty: 'medium' },
  { id: 109, word: 'whether', sentence: 'I wonder if it will happen.', category: 'homophones', difficulty: 'medium' },
  { id: 110, word: 'your', sentence: 'This belongs to you.', category: 'homophones', difficulty: 'easy' },
  { id: 111, word: 'to', sentence: 'Go over to the shop.', category: 'homophones', difficulty: 'easy' },
  { id: 112, word: 'too', sentence: 'I want one as well.', category: 'homophones', difficulty: 'easy' },
  { id: 113, word: 'two', sentence: 'The number after one.', category: 'homophones', difficulty: 'easy' },
  { id: 114, word: 'which', sentence: 'Pick one of these.', category: 'homophones', difficulty: 'medium' },
  { id: 115, word: 'witch', sentence: 'She has a black cat.', category: 'homophones', difficulty: 'medium' },
  { id: 116, word: 'week', sentence: 'Seven days long.', category: 'homophones', difficulty: 'easy' },
  { id: 117, word: 'weak', sentence: 'Not very strong.', category: 'homophones', difficulty: 'easy' },
  { id: 118, word: 'right', sentence: 'The correct answer.', category: 'homophones', difficulty: 'easy' },
  { id: 119, word: 'write', sentence: 'Use a pen for this.', category: 'homophones', difficulty: 'easy' },

  // ===== HARD SPELLINGS (15) =====
  { id: 120, word: 'definitely', sentence: 'I am totally sure.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 121, word: 'separate', sentence: 'Keep them apart.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 122, word: 'government', sentence: 'The leaders of our country.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 123, word: 'queue', sentence: 'Wait in the line.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 124, word: 'conscience', sentence: 'Knowing right from wrong.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 125, word: 'mischievous', sentence: 'Being a bit naughty.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 126, word: 'restaurant', sentence: 'A place to eat meals.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 127, word: 'Wednesday', sentence: 'The middle of the week.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 128, word: 'February', sentence: 'The shortest month.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 129, word: 'knowledge', sentence: 'What you learn and know.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 130, word: 'vegetable', sentence: 'Carrots and peas are these.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 131, word: 'chocolate', sentence: 'A sweet brown treat.', category: 'hard-spellings', difficulty: 'medium' },
  { id: 132, word: 'actually', sentence: 'In fact, this is true.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 133, word: 'basically', sentence: 'Simply put, this is it.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 134, word: 'probably', sentence: 'Most likely this will happen.', category: 'hard-spellings', difficulty: 'hard' },

  // ===== PREFIXES (15) =====
  { id: 135, word: 'unhappy', sentence: 'Feeling a bit sad.', category: 'prefixes', difficulty: 'easy' },
  { id: 136, word: 'unusual', sentence: 'Not like the others.', category: 'prefixes', difficulty: 'medium' },
  { id: 137, word: 'unknown', sentence: 'Nobody knows about it.', category: 'prefixes', difficulty: 'medium' },
  { id: 138, word: 'untidy', sentence: 'A bit of a mess.', category: 'prefixes', difficulty: 'easy' },
  { id: 139, word: 'return', sentence: 'Come back again.', category: 'prefixes', difficulty: 'easy' },
  { id: 140, word: 'rewrite', sentence: 'Do it again on paper.', category: 'prefixes', difficulty: 'medium' },
  { id: 141, word: 'remember', sentence: 'Keep it in your mind.', category: 'prefixes', difficulty: 'medium' },
  { id: 142, word: 'replace', sentence: 'Put a new one instead.', category: 'prefixes', difficulty: 'medium' },
  { id: 143, word: 'disappear', sentence: 'It vanished from sight.', category: 'prefixes', difficulty: 'hard' },
  { id: 144, word: 'disagree', sentence: 'I think differently.', category: 'prefixes', difficulty: 'medium' },
  { id: 145, word: 'discover', sentence: 'Find something new.', category: 'prefixes', difficulty: 'medium' },
  { id: 146, word: 'impossible', sentence: 'It cannot be done.', category: 'prefixes', difficulty: 'hard' },
  { id: 147, word: 'invisible', sentence: 'You cannot see it.', category: 'prefixes', difficulty: 'hard' },
  { id: 148, word: 'incorrect', sentence: 'That is wrong.', category: 'prefixes', difficulty: 'medium' },
  { id: 149, word: 'uncomfortable', sentence: 'Not feeling relaxed.', category: 'prefixes', difficulty: 'hard' },

  // ===== COMPOUND WORDS (12) =====
  { id: 150, word: 'something', sentence: 'There is a thing here.', category: 'compound', difficulty: 'easy' },
  { id: 151, word: 'everyone', sentence: 'All the people.', category: 'compound', difficulty: 'easy' },
  { id: 152, word: 'sometimes', sentence: 'Now and then.', category: 'compound', difficulty: 'easy' },
  { id: 153, word: 'everything', sentence: 'All of the things.', category: 'compound', difficulty: 'easy' },
  { id: 154, word: 'somewhere', sentence: 'In some place.', category: 'compound', difficulty: 'medium' },
  { id: 155, word: 'meanwhile', sentence: 'At the same time.', category: 'compound', difficulty: 'medium' },
  { id: 156, word: 'anywhere', sentence: 'In any place at all.', category: 'compound', difficulty: 'medium' },
  { id: 157, word: 'nothing', sentence: 'Not anything at all.', category: 'compound', difficulty: 'easy' },
  { id: 158, word: 'playground', sentence: 'Where children play.', category: 'compound', difficulty: 'easy' },
  { id: 159, word: 'birthday', sentence: 'The day you were born.', category: 'compound', difficulty: 'easy' },
  { id: 160, word: 'homework', sentence: 'School work at home.', category: 'compound', difficulty: 'easy' },
  { id: 161, word: 'breakfast', sentence: 'The first meal.', category: 'compound', difficulty: 'medium' },

  // ===== MORE TRICKY WORDS (25) =====
  { id: 162, word: 'February', sentence: 'The second month of the year.', category: 'tricky', difficulty: 'hard' },
  { id: 163, word: 'business', sentence: 'Running a shop or company.', category: 'tricky', difficulty: 'hard' },
  { id: 164, word: 'Wednesday', sentence: 'The middle of the week.', category: 'tricky', difficulty: 'medium' },
  { id: 165, word: 'separate', sentence: 'Keep things apart.', category: 'tricky', difficulty: 'hard' },
  { id: 166, word: 'definitely', sentence: 'For certain, without doubt.', category: 'tricky', difficulty: 'hard' },
  { id: 167, word: 'parliament', sentence: 'Where laws are made.', category: 'tricky', difficulty: 'hard' },
  { id: 168, word: 'government', sentence: 'People who run the country.', category: 'tricky', difficulty: 'hard' },
  { id: 169, word: 'environment', sentence: 'The world around us.', category: 'tricky', difficulty: 'hard' },
  { id: 170, word: 'develop', sentence: 'To grow and improve.', category: 'tricky', difficulty: 'medium' },
  { id: 171, word: 'interest', sentence: 'Something you find exciting.', category: 'tricky', difficulty: 'medium' },
  { id: 172, word: 'certain', sentence: 'I am sure about it.', category: 'tricky', difficulty: 'medium' },
  { id: 173, word: 'different', sentence: 'Not the same as others.', category: 'tricky', difficulty: 'medium' },
  { id: 174, word: 'difficult', sentence: 'Hard to do or understand.', category: 'tricky', difficulty: 'medium' },
  { id: 175, word: 'important', sentence: 'Something that really matters.', category: 'tricky', difficulty: 'medium' },
  { id: 176, word: 'remember', sentence: 'Keep in your mind.', category: 'tricky', difficulty: 'medium' },
  { id: 177, word: 'particular', sentence: 'One specific thing.', category: 'tricky', difficulty: 'hard' },
  { id: 178, word: 'regular', sentence: 'Happens often at set times.', category: 'tricky', difficulty: 'medium' },
  { id: 179, word: 'ordinary', sentence: 'Nothing special or unusual.', category: 'tricky', difficulty: 'medium' },
  { id: 180, word: 'century', sentence: 'One hundred years.', category: 'tricky', difficulty: 'medium' },
  { id: 181, word: 'various', sentence: 'Several different types.', category: 'tricky', difficulty: 'hard' },
  { id: 182, word: 'physical', sentence: 'To do with the body.', category: 'tricky', difficulty: 'hard' },
  { id: 183, word: 'continue', sentence: 'Keep going without stopping.', category: 'tricky', difficulty: 'medium' },
  { id: 184, word: 'decide', sentence: 'Make up your mind.', category: 'tricky', difficulty: 'easy' },
  { id: 185, word: 'describe', sentence: 'Tell what it is like.', category: 'tricky', difficulty: 'medium' },
  { id: 186, word: 'perhaps', sentence: 'It might happen, maybe.', category: 'tricky', difficulty: 'medium' },

  // ===== MORE DOUBLE LETTERS (20) =====
  { id: 187, word: 'tomorrow', sentence: 'The day after today.', category: 'double-letters', difficulty: 'medium' },
  { id: 188, word: 'happened', sentence: 'It took place before now.', category: 'double-letters', difficulty: 'medium' },
  { id: 189, word: 'beginning', sentence: 'The start of something.', category: 'double-letters', difficulty: 'hard' },
  { id: 190, word: 'success', sentence: 'When you do really well.', category: 'double-letters', difficulty: 'hard' },
  { id: 191, word: 'possess', sentence: 'To own or have something.', category: 'double-letters', difficulty: 'hard' },
  { id: 192, word: 'address', sentence: 'Where you live or send letters.', category: 'double-letters', difficulty: 'medium' },
  { id: 193, word: 'embarrass', sentence: 'Make someone feel awkward.', category: 'double-letters', difficulty: 'hard' },
  { id: 194, word: 'necessary', sentence: 'Something you must have.', category: 'double-letters', difficulty: 'hard' },
  { id: 195, word: 'occasion', sentence: 'A special time or event.', category: 'double-letters', difficulty: 'hard' },
  { id: 196, word: 'immediately', sentence: 'Right now, at once.', category: 'double-letters', difficulty: 'hard' },
  { id: 197, word: 'disappoint', sentence: 'Let someone down, make sad.', category: 'double-letters', difficulty: 'hard' },
  { id: 198, word: 'appreciate', sentence: 'Be thankful for something.', category: 'double-letters', difficulty: 'hard' },
  { id: 199, word: 'opposite', sentence: 'Complete other way round.', category: 'double-letters', difficulty: 'medium' },
  { id: 200, word: 'accept', sentence: 'Take what is offered.', category: 'double-letters', difficulty: 'medium' },
  { id: 201, word: 'manner', sentence: 'The way you behave.', category: 'double-letters', difficulty: 'medium' },
  { id: 202, word: 'summer', sentence: 'The warm season after spring.', category: 'double-letters', difficulty: 'easy' },
  { id: 203, word: 'dinner', sentence: 'The main meal of the day.', category: 'double-letters', difficulty: 'easy' },
  { id: 204, word: 'rabbit', sentence: 'A fluffy hopping animal.', category: 'double-letters', difficulty: 'easy' },
  { id: 205, word: 'bottle', sentence: 'A container for drinks.', category: 'double-letters', difficulty: 'easy' },
  { id: 206, word: 'letters', sentence: 'The alphabet symbols, a-z.', category: 'double-letters', difficulty: 'easy' },

  // ===== MORE SILENT LETTERS (15) =====
  { id: 207, word: 'doubt', sentence: 'Not being sure about something.', category: 'silent-letters', difficulty: 'hard' },
  { id: 208, word: 'island', sentence: 'Land surrounded by water.', category: 'silent-letters', difficulty: 'medium' },
  { id: 209, word: 'wrestle', sentence: 'Fight by holding and pushing.', category: 'silent-letters', difficulty: 'hard' },
  { id: 210, word: 'honest', sentence: 'Always telling the truth.', category: 'silent-letters', difficulty: 'medium' },
  { id: 211, word: 'honour', sentence: 'Respect and good reputation.', category: 'silent-letters', difficulty: 'hard' },
  { id: 212, word: 'answer', sentence: 'Reply to a question.', category: 'silent-letters', difficulty: 'medium' },
  { id: 213, word: 'listen', sentence: 'Pay attention with your ears.', category: 'silent-letters', difficulty: 'easy' },
  { id: 214, word: 'castle', sentence: 'A big stone fortress building.', category: 'silent-letters', difficulty: 'easy' },
  { id: 215, word: 'fasten', sentence: 'Join or attach things together.', category: 'silent-letters', difficulty: 'medium' },
  { id: 216, word: 'often', sentence: 'Many times, frequently.', category: 'silent-letters', difficulty: 'easy' },
  { id: 217, word: 'soften', sentence: 'Make something less hard.', category: 'silent-letters', difficulty: 'medium' },
  { id: 218, word: 'thistle', sentence: 'A prickly wild plant.', category: 'silent-letters', difficulty: 'hard' },
  { id: 219, word: 'design', sentence: 'Plan how something will look.', category: 'silent-letters', difficulty: 'medium' },
  { id: 220, word: 'resign', sentence: 'Leave your job or position.', category: 'silent-letters', difficulty: 'hard' },
  { id: 221, word: 'campaign', sentence: 'Organised effort to achieve a goal.', category: 'silent-letters', difficulty: 'hard' },

  // ===== MORE WORD ENDINGS (20) =====
  { id: 222, word: 'permission', sentence: 'Being allowed to do something.', category: 'endings', difficulty: 'hard' },
  { id: 223, word: 'discussion', sentence: 'Talking about a topic together.', category: 'endings', difficulty: 'hard' },
  { id: 224, word: 'expression', sentence: 'The look on your face.', category: 'endings', difficulty: 'hard' },
  { id: 225, word: 'profession', sentence: 'The job you do for work.', category: 'endings', difficulty: 'hard' },
  { id: 226, word: 'possession', sentence: 'Something that belongs to you.', category: 'endings', difficulty: 'hard' },
  { id: 227, word: 'confusion', sentence: 'Being mixed up and unclear.', category: 'endings', difficulty: 'hard' },
  { id: 228, word: 'decision', sentence: 'A choice you have made.', category: 'endings', difficulty: 'medium' },
  { id: 229, word: 'television', sentence: 'The TV you watch shows on.', category: 'endings', difficulty: 'medium' },
  { id: 230, word: 'division', sentence: 'Splitting into parts or groups.', category: 'endings', difficulty: 'medium' },
  { id: 231, word: 'revision', sentence: 'Going over work to learn it.', category: 'endings', difficulty: 'hard' },
  { id: 232, word: 'famous', sentence: 'Known by many people.', category: 'endings', difficulty: 'easy' },
  { id: 233, word: 'dangerous', sentence: 'Could cause harm or hurt.', category: 'endings', difficulty: 'medium' },
  { id: 234, word: 'generous', sentence: 'Happy to give and share.', category: 'endings', difficulty: 'medium' },
  { id: 235, word: 'nervous', sentence: 'Feeling worried or scared.', category: 'endings', difficulty: 'medium' },
  { id: 236, word: 'curious', sentence: 'Wanting to know more.', category: 'endings', difficulty: 'medium' },
  { id: 237, word: 'serious', sentence: 'Not joking, very important.', category: 'endings', difficulty: 'medium' },
  { id: 238, word: 'obvious', sentence: 'Very easy to see or understand.', category: 'endings', difficulty: 'hard' },
  { id: 239, word: 'previous', sentence: 'The one that came before.', category: 'endings', difficulty: 'hard' },
  { id: 240, word: 'various', sentence: 'Many different types.', category: 'endings', difficulty: 'hard' },
  { id: 241, word: 'furious', sentence: 'Very angry indeed.', category: 'endings', difficulty: 'medium' },

  // ===== MORE SOFT C WORDS (15) =====
  { id: 242, word: 'city', sentence: 'A big town with many people.', category: 'soft-c', difficulty: 'easy' },
  { id: 243, word: 'circle', sentence: 'A round shape like a ring.', category: 'soft-c', difficulty: 'easy' },
  { id: 244, word: 'ceiling', sentence: 'The top of a room inside.', category: 'soft-c', difficulty: 'medium' },
  { id: 245, word: 'centre', sentence: 'The middle point of something.', category: 'soft-c', difficulty: 'medium' },
  { id: 246, word: 'certain', sentence: 'Completely sure about it.', category: 'soft-c', difficulty: 'medium' },
  { id: 247, word: 'celebrate', sentence: 'Have a party for something good.', category: 'soft-c', difficulty: 'medium' },
  { id: 248, word: 'century', sentence: 'A hundred years of time.', category: 'soft-c', difficulty: 'medium' },
  { id: 249, word: 'principal', sentence: 'The head teacher of a school.', category: 'soft-c', difficulty: 'hard' },
  { id: 250, word: 'medicine', sentence: 'Something to make you better.', category: 'soft-c', difficulty: 'medium' },
  { id: 251, word: 'bicycle', sentence: 'A bike with two wheels.', category: 'soft-c', difficulty: 'easy' },
  { id: 252, word: 'decide', sentence: 'Choose what you will do.', category: 'soft-c', difficulty: 'medium' },
  { id: 253, word: 'recent', sentence: 'Not long ago, quite new.', category: 'soft-c', difficulty: 'medium' },
  { id: 254, word: 'decent', sentence: 'Good enough, acceptable.', category: 'soft-c', difficulty: 'hard' },
  { id: 255, word: 'percent', sentence: 'Out of one hundred parts.', category: 'soft-c', difficulty: 'hard' },
  { id: 256, word: 'balance', sentence: 'Being steady, not falling over.', category: 'soft-c', difficulty: 'medium' },

  // ===== MORE HOMOPHONES (15) =====
  { id: 257, word: 'whether', sentence: 'If this or that happens.', category: 'homophones', difficulty: 'hard' },
  { id: 258, word: 'weather', sentence: 'Rain, sun, wind or snow outside.', category: 'homophones', difficulty: 'medium' },
  { id: 259, word: 'accept', sentence: 'To take or agree to something.', category: 'homophones', difficulty: 'hard' },
  { id: 260, word: 'except', sentence: 'Not including this one thing.', category: 'homophones', difficulty: 'hard' },
  { id: 261, word: 'affect', sentence: 'To change or influence something.', category: 'homophones', difficulty: 'hard' },
  { id: 262, word: 'effect', sentence: 'The result of what happened.', category: 'homophones', difficulty: 'hard' },
  { id: 263, word: 'brake', sentence: 'Stop a car or bike moving.', category: 'homophones', difficulty: 'medium' },
  { id: 264, word: 'break', sentence: 'Smash into pieces or snap.', category: 'homophones', difficulty: 'medium' },
  { id: 265, word: 'medal', sentence: 'A prize for winning something.', category: 'homophones', difficulty: 'medium' },
  { id: 266, word: 'meddle', sentence: 'Interfere with someone else.', category: 'homophones', difficulty: 'hard' },
  { id: 267, word: 'father', sentence: 'Your male parent, your dad.', category: 'homophones', difficulty: 'easy' },
  { id: 268, word: 'farther', sentence: 'A longer distance away.', category: 'homophones', difficulty: 'hard' },
  { id: 269, word: 'peace', sentence: 'No fighting or war, calm.', category: 'homophones', difficulty: 'medium' },
  { id: 270, word: 'piece', sentence: 'A part or bit of something.', category: 'homophones', difficulty: 'medium' },
  { id: 271, word: 'principal', sentence: 'Most important or main one.', category: 'homophones', difficulty: 'hard' },

  // ===== MORE HARD SPELLINGS (15) =====
  { id: 272, word: 'excellent', sentence: 'Very very good indeed.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 273, word: 'experience', sentence: 'Something that happened to you.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 274, word: 'explanation', sentence: 'Telling how or why something is.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 275, word: 'exaggerate', sentence: 'Make something sound bigger.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 276, word: 'temperature', sentence: 'How hot or cold it is.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 277, word: 'literature', sentence: 'Books and written stories.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 278, word: 'recommend', sentence: 'Say something is good to try.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 279, word: 'restaurant', sentence: 'A place to eat meals out.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 280, word: 'secretary', sentence: 'Someone who does office work.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 281, word: 'recognise', sentence: 'Know who someone is when you see.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 282, word: 'pronunciation', sentence: 'How a word should sound.', category: 'hard-spellings', difficulty: 'hard' },
  { id: 283, word: 'language', sentence: 'The words people speak.', category: 'hard-spellings', difficulty: 'medium' },
  { id: 284, word: 'lightning', sentence: 'Bright flash in a storm.', category: 'hard-spellings', difficulty: 'medium' },
  { id: 285, word: 'soldier', sentence: 'Someone in the army.', category: 'hard-spellings', difficulty: 'medium' },
  { id: 286, word: 'amateur', sentence: 'Not a professional, just for fun.', category: 'hard-spellings', difficulty: 'hard' },

  // ===== MORE PREFIXES (10) =====
  { id: 287, word: 'misunderstand', sentence: 'Get the wrong idea about something.', category: 'prefixes', difficulty: 'hard' },
  { id: 288, word: 'misbehave', sentence: 'Act badly or naughty.', category: 'prefixes', difficulty: 'medium' },
  { id: 289, word: 'illegal', sentence: 'Against the law, not allowed.', category: 'prefixes', difficulty: 'hard' },
  { id: 290, word: 'irregular', sentence: 'Not following the normal pattern.', category: 'prefixes', difficulty: 'hard' },
  { id: 291, word: 'inactive', sentence: 'Not moving or doing anything.', category: 'prefixes', difficulty: 'medium' },
  { id: 292, word: 'international', sentence: 'Between different countries.', category: 'prefixes', difficulty: 'hard' },
  { id: 293, word: 'preview', sentence: 'Look at something before it starts.', category: 'prefixes', difficulty: 'medium' },
  { id: 294, word: 'submarine', sentence: 'A ship that goes under water.', category: 'prefixes', difficulty: 'medium' },
  { id: 295, word: 'supermarket', sentence: 'Big shop selling food and goods.', category: 'prefixes', difficulty: 'easy' },
  { id: 296, word: 'telephone', sentence: 'Device for speaking to someone far.', category: 'prefixes', difficulty: 'easy' },

  // ===== MORE COMPOUND WORDS (4) =====
  { id: 297, word: 'understand', sentence: 'Know what something means.', category: 'compound', difficulty: 'easy' },
  { id: 298, word: 'somebody', sentence: 'A person, not sure who.', category: 'compound', difficulty: 'easy' },
  { id: 299, word: 'weekend', sentence: 'Saturday and Sunday together.', category: 'compound', difficulty: 'easy' },
  { id: 300, word: 'afternoon', sentence: 'Time between midday and evening.', category: 'compound', difficulty: 'easy' },

  // ===== SUFFIXES (18 words) =====
  { id: 301, word: 'playing', sentence: 'Having fun with toys or games.', category: 'suffixes', difficulty: 'easy' },
  { id: 302, word: 'running', sentence: 'Moving fast on your feet.', category: 'suffixes', difficulty: 'easy' },
  { id: 303, word: 'quickly', sentence: 'Done in a fast way.', category: 'suffixes', difficulty: 'easy' },
  { id: 304, word: 'slowly', sentence: 'Done in a slow way.', category: 'suffixes', difficulty: 'easy' },
  { id: 305, word: 'beautiful', sentence: 'Very pretty to look at.', category: 'suffixes', difficulty: 'medium' },
  { id: 306, word: 'wonderful', sentence: 'Really amazing and great.', category: 'suffixes', difficulty: 'medium' },
  { id: 307, word: 'hopeless', sentence: 'No chance of getting better.', category: 'suffixes', difficulty: 'medium' },
  { id: 308, word: 'careless', sentence: 'Not being careful enough.', category: 'suffixes', difficulty: 'medium' },
  { id: 309, word: 'happiness', sentence: 'The feeling of being happy.', category: 'suffixes', difficulty: 'medium' },
  { id: 310, word: 'darkness', sentence: 'When there is no light.', category: 'suffixes', difficulty: 'easy' },
  { id: 311, word: 'enjoyment', sentence: 'Having a good time.', category: 'suffixes', difficulty: 'medium' },
  { id: 312, word: 'movement', sentence: 'Changing position or place.', category: 'suffixes', difficulty: 'medium' },
  { id: 313, word: 'comfortable', sentence: 'Nice and cosy to use.', category: 'suffixes', difficulty: 'hard' },
  { id: 314, word: 'valuable', sentence: 'Worth a lot of money.', category: 'suffixes', difficulty: 'medium' },
  { id: 315, word: 'terrible', sentence: 'Very bad or awful.', category: 'suffixes', difficulty: 'medium' },
  { id: 316, word: 'kindness', sentence: 'Being nice to other people.', category: 'suffixes', difficulty: 'easy' },
  { id: 317, word: 'useful', sentence: 'Helpful for doing something.', category: 'suffixes', difficulty: 'easy' },
  { id: 318, word: 'endless', sentence: 'Going on and on forever.', category: 'suffixes', difficulty: 'medium' },

  // ===== TRICKY PLURALS (20 words) =====
  { id: 319, word: 'babies', sentence: 'More than one baby.', category: 'plurals', difficulty: 'easy' },
  { id: 320, word: 'ladies', sentence: 'More than one lady.', category: 'plurals', difficulty: 'easy' },
  { id: 321, word: 'stories', sentence: 'More than one story.', category: 'plurals', difficulty: 'easy' },
  { id: 322, word: 'knives', sentence: 'More than one knife.', category: 'plurals', difficulty: 'medium' },
  { id: 323, word: 'wives', sentence: 'More than one wife.', category: 'plurals', difficulty: 'medium' },
  { id: 324, word: 'lives', sentence: 'More than one life.', category: 'plurals', difficulty: 'medium' },
  { id: 325, word: 'shelves', sentence: 'More than one shelf.', category: 'plurals', difficulty: 'medium' },
  { id: 326, word: 'loaves', sentence: 'More than one loaf of bread.', category: 'plurals', difficulty: 'hard' },
  { id: 327, word: 'thieves', sentence: 'More than one thief.', category: 'plurals', difficulty: 'medium' },
  { id: 328, word: 'children', sentence: 'More than one child.', category: 'plurals', difficulty: 'easy' },
  { id: 329, word: 'teeth', sentence: 'More than one tooth.', category: 'plurals', difficulty: 'easy' },
  { id: 330, word: 'feet', sentence: 'More than one foot.', category: 'plurals', difficulty: 'easy' },
  { id: 331, word: 'geese', sentence: 'More than one goose.', category: 'plurals', difficulty: 'medium' },
  { id: 332, word: 'mice', sentence: 'More than one mouse.', category: 'plurals', difficulty: 'easy' },
  { id: 333, word: 'men', sentence: 'More than one man.', category: 'plurals', difficulty: 'easy' },
  { id: 334, word: 'women', sentence: 'More than one woman.', category: 'plurals', difficulty: 'easy' },
  { id: 335, word: 'oxen', sentence: 'More than one ox.', category: 'plurals', difficulty: 'hard' },
  { id: 336, word: 'heroes', sentence: 'More than one hero.', category: 'plurals', difficulty: 'medium' },
  { id: 337, word: 'potatoes', sentence: 'More than one potato.', category: 'plurals', difficulty: 'medium' },
  { id: 338, word: 'tomatoes', sentence: 'More than one tomato.', category: 'plurals', difficulty: 'medium' },

  // ===== IRREGULAR PAST TENSE (20 words) =====
  { id: 339, word: 'ran', sentence: 'She ran to catch the bus.', category: 'past-tense', difficulty: 'easy' },
  { id: 340, word: 'went', sentence: 'We went to the park yesterday.', category: 'past-tense', difficulty: 'easy' },
  { id: 341, word: 'came', sentence: 'They came to visit last week.', category: 'past-tense', difficulty: 'easy' },
  { id: 342, word: 'saw', sentence: 'I saw a rainbow this morning.', category: 'past-tense', difficulty: 'easy' },
  { id: 343, word: 'ate', sentence: 'He ate all his dinner.', category: 'past-tense', difficulty: 'easy' },
  { id: 344, word: 'wrote', sentence: 'She wrote a letter to her friend.', category: 'past-tense', difficulty: 'medium' },
  { id: 345, word: 'spoke', sentence: 'The teacher spoke to the class.', category: 'past-tense', difficulty: 'medium' },
  { id: 346, word: 'broke', sentence: 'The vase broke when it fell.', category: 'past-tense', difficulty: 'easy' },
  { id: 347, word: 'chose', sentence: 'She chose the red one.', category: 'past-tense', difficulty: 'medium' },
  { id: 348, word: 'drove', sentence: 'Dad drove us to school.', category: 'past-tense', difficulty: 'easy' },
  { id: 349, word: 'flew', sentence: 'The bird flew away quickly.', category: 'past-tense', difficulty: 'easy' },
  { id: 350, word: 'knew', sentence: 'I knew the answer straight away.', category: 'past-tense', difficulty: 'medium' },
  { id: 351, word: 'threw', sentence: 'He threw the ball over the fence.', category: 'past-tense', difficulty: 'medium' },
  { id: 352, word: 'grew', sentence: 'The flowers grew in the spring.', category: 'past-tense', difficulty: 'easy' },
  { id: 353, word: 'sang', sentence: 'We sang happy birthday together.', category: 'past-tense', difficulty: 'easy' },
  { id: 354, word: 'swam', sentence: 'She swam across the pool.', category: 'past-tense', difficulty: 'easy' },
  { id: 355, word: 'won', sentence: 'Our team won the match.', category: 'past-tense', difficulty: 'easy' },
  { id: 356, word: 'taught', sentence: 'Miss Jones taught us about fractions.', category: 'past-tense', difficulty: 'hard' },
  { id: 357, word: 'caught', sentence: 'I caught the ball with one hand.', category: 'past-tense', difficulty: 'medium' },
  { id: 358, word: 'brought', sentence: 'She brought her favourite toy.', category: 'past-tense', difficulty: 'medium' },
];

const sampleRewards = [
  // ========== TINY TREATS (50-100 coins) - Daily wins ==========
  { id: 1, name: 'Gold Star Sticker', cost: 50, icon: '⭐', category: 'real-world', rarity: 1 },
  { id: 2, name: 'High Five from Dad', cost: 50, icon: '🖐️', category: 'real-world', rarity: 1 },
  { id: 3, name: 'Victory Dance', cost: 75, icon: '💃', category: 'real-world', rarity: 1 },
  { id: 4, name: 'Silly Photo Together', cost: 75, icon: '🤳', category: 'real-world', rarity: 1 },
  { id: 5, name: 'Pick Background Music', cost: 100, icon: '🎵', category: 'real-world', rarity: 1 },
  { id: 6, name: 'Stay Up 10 Mins Late', cost: 100, icon: '🌙', category: 'real-world', rarity: 1 },

  // ========== QUICK WINS (125-300 coins) - Few days ==========
  { id: 7, name: 'Stay Up 15 Mins Late', cost: 125, icon: '🌛', category: 'real-world', rarity: 1 },
  { id: 8, name: 'Pick a Snack', cost: 150, icon: '🍿', category: 'real-world', rarity: 1 },
  { id: 9, name: 'Extra TV Episode', cost: 175, icon: '📺', category: 'real-world', rarity: 1 },
  { id: 10, name: 'No Chores Pass', cost: 200, icon: '🎫', category: 'real-world', rarity: 1 },
  { id: 11, name: 'Cookie Treat', cost: 200, icon: '🍪', category: 'real-world', rarity: 1 },
  { id: 12, name: 'Extra Dessert', cost: 225, icon: '🧁', category: 'real-world', rarity: 1 },
  { id: 13, name: 'Pick Car Music', cost: 250, icon: '🚗', category: 'real-world', rarity: 1 },
  { id: 14, name: 'Lie In (30 mins)', cost: 275, icon: '😴', category: 'real-world', rarity: 2 },
  { id: 15, name: 'Stay Up 30 Mins Late', cost: 300, icon: '🌜', category: 'real-world', rarity: 2 },

  // ========== TREATS (350-700 coins) - Weekly goals ==========
  { id: 16, name: 'Boba Tea', cost: 350, icon: '🧋' },
  { id: 17, name: 'Pick Movie Night', cost: 400, icon: '🎬' },
  { id: 18, name: 'Smoothie Trip', cost: 425, icon: '🥤' },
  { id: 19, name: '30 Mins Screen Time', cost: 450, icon: '📱' },
  { id: 20, name: 'Hot Chocolate Trip', cost: 475, icon: '☕' },
  { id: 21, name: 'Sweet Shop Visit', cost: 500, icon: '🍬' },
  { id: 22, name: 'Ice Cream Trip', cost: 525, icon: '🍦' },
  { id: 23, name: 'Milkshake Trip', cost: 550, icon: '🥛' },
  { id: 24, name: 'Donut Run', cost: 575, icon: '🍩' },
  { id: 25, name: 'Breakfast in Bed', cost: 600, icon: '🥞' },
  { id: 26, name: 'Pancake Morning', cost: 625, icon: '🥞' },
  { id: 27, name: 'Waffle Treat', cost: 650, icon: '🧇' },
  { id: 28, name: 'Pick Dinner', cost: 700, icon: '🍕' },

  // ========== ACTIVITIES (750-1200 coins) - Bi-weekly goals ==========
  { id: 29, name: 'Games Night (Your Rules)', cost: 750, icon: '🎮' },
  { id: 30, name: 'Park Picnic', cost: 800, icon: '🧺' },
  { id: 31, name: '1 Hour Screen Time', cost: 850, icon: '💻' },
  { id: 32, name: 'Bubble Bath with Extras', cost: 900, icon: '🛁' },
  { id: 33, name: 'Nail Painting Session', cost: 950, icon: '💅' },
  { id: 34, name: 'Dance Party', cost: 1000, icon: '🪩' },
  { id: 35, name: 'Puzzle Together', cost: 1050, icon: '🧩' },
  { id: 36, name: 'Build Something Together', cost: 1100, icon: '🔧' },
  { id: 37, name: 'Art Session', cost: 1150, icon: '🎨' },
  { id: 38, name: 'New Book', cost: 1200, icon: '📚' },

  // ========== BIG REWARDS (1300-2000 coins) - Monthly goals ==========
  { id: 39, name: 'Cinema Trip', cost: 1300, icon: '🎥' },
  { id: 40, name: 'Bowling Trip', cost: 1400, icon: '🎳' },
  { id: 41, name: 'Baking Day Together', cost: 1500, icon: '🍰' },
  { id: 42, name: 'Craft Supplies Haul', cost: 1550, icon: '✂️' },
  { id: 43, name: 'Mini Golf', cost: 1600, icon: '⛳' },
  { id: 44, name: 'Trampoline Park', cost: 1700, icon: '🤸' },
  { id: 45, name: 'Friend Playdate', cost: 1800, icon: '👯' },
  { id: 46, name: 'Swimming Trip', cost: 1850, icon: '🏊' },
  { id: 47, name: 'Takeaway Night', cost: 1900, icon: '🥡' },
  { id: 48, name: 'Skip a Homework', cost: 2000, icon: '📝' },

  // ========== ADVENTURES (2200-3500 coins) - Term goals ==========
  { id: 49, name: 'Day Out (Local)', cost: 2200, icon: '🎡' },
  { id: 50, name: 'Escape Room', cost: 2400, icon: '🔐' },
  { id: 51, name: 'Pottery Painting', cost: 2500, icon: '🏺' },
  { id: 52, name: 'Soft Play (Big Kid Zone)', cost: 2600, icon: '🏰' },
  { id: 53, name: 'Laser Tag', cost: 2800, icon: '🔫' },
  { id: 54, name: 'Friend Sleepover', cost: 3000, icon: '🛏️' },
  { id: 55, name: 'Zoo/Aquarium Trip', cost: 3200, icon: '🐧' },
  { id: 56, name: 'Ice Skating', cost: 3400, icon: '⛸️' },

  // ========== EPIC REWARDS (3600-5500 coins) - Half-term goals ==========
  { id: 57, name: 'Shopping Trip', cost: 3600, icon: '🛍️' },
  { id: 58, name: 'Choose a New Game', cost: 3800, icon: '🎲' },
  { id: 59, name: 'Climbing Wall', cost: 4000, icon: '🧗' },
  { id: 60, name: 'Beach Day', cost: 4200, icon: '🏖️' },
  { id: 61, name: 'Theme Park Day', cost: 4500, icon: '🎢' },
  { id: 62, name: 'Water Park', cost: 4800, icon: '🌊' },
  { id: 63, name: 'Special Day Out', cost: 5000, icon: '✨' },
  { id: 64, name: 'Sleepover Party (2 Friends)', cost: 5500, icon: '🎉' },

  // ========== LEGENDARY (6000-10000 coins) - Half-year goals ==========
  { id: 65, name: 'Big Surprise', cost: 6000, icon: '🎁' },
  { id: 66, name: 'Museum/Gallery Trip', cost: 6500, icon: '🏛️' },
  { id: 67, name: 'Adventure Day', cost: 7000, icon: '🗺️' },
  { id: 68, name: 'Theatre Show', cost: 7500, icon: '🎭' },
  { id: 69, name: 'Concert/Show Tickets', cost: 8000, icon: '🎤' },
  { id: 70, name: 'Spa Day', cost: 8500, icon: '🧖' },
  { id: 71, name: 'Castle/Palace Visit', cost: 9000, icon: '🏰' },
  { id: 72, name: 'Forest Adventure', cost: 9500, icon: '🌲' },
  { id: 73, name: 'Ultimate Day Out', cost: 10000, icon: '🌟' },

  // ========== MYTHIC (11000-18000 coins) - Year goals ==========
  { id: 74, name: 'Makeover Day', cost: 11000, icon: '💄' },
  { id: 75, name: 'Redecorate Room', cost: 12000, icon: '🛋️' },
  { id: 76, name: 'Photography Day', cost: 13000, icon: '📸' },
  { id: 77, name: 'Cooking Class', cost: 14000, icon: '👩‍🍳' },
  { id: 78, name: 'New Gadget', cost: 15000, icon: '📱' },
  { id: 79, name: 'Horse Riding Lesson', cost: 16000, icon: '🐴' },
  { id: 80, name: 'Glamping Night', cost: 17000, icon: '⛺' },
  { id: 81, name: 'Weekend Trip', cost: 18000, icon: '🏨' },

  // ========== ULTIMATE (20000-30000 coins) - Champion rewards ==========
  { id: 82, name: 'Birthday Party Upgrade', cost: 20000, icon: '🎂' },
  { id: 83, name: 'Design Your Day', cost: 22000, icon: '📋' },
  { id: 84, name: 'Year Champion Prize', cost: 25000, icon: '🏆' },
  { id: 85, name: 'Ultimate Adventure', cost: 28000, icon: '🚀' },
  { id: 86, name: 'Dream Day', cost: 30000, icon: '👸' },
];

// ============ TIERED REWARD SYSTEM ============
// Calculate cost per subject (split evenly across 4 subjects)
const getRewardCostPerSubject = (totalCost) => {
  const perSubject = Math.floor(totalCost / 4);
  const remainder = totalCost - (perSubject * 4);
  return {
    spelling: perSubject,
    maths: perSubject,
    science: perSubject,
    history: perSubject + remainder // Remainder goes to history
  };
};

// Check if player can afford reward (uses TOTAL coins across all subjects)
// This allows kids to afford rewards even if one subject is lower
const canAffordReward = (reward, gameData) => {
  const totalCoins = (gameData.spelling?.coins || 0) +
                     (gameData.maths?.coins || 0) +
                     (gameData.science?.coins || 0) +
                     (gameData.history?.coins || 0);
  return totalCoins >= reward.cost;
};

// Get total coins gap (how many more coins needed overall)
const getRewardGaps = (reward, gameData) => {
  const totalCoins = (gameData.spelling?.coins || 0) +
                     (gameData.maths?.coins || 0) +
                     (gameData.science?.coins || 0) +
                     (gameData.history?.coins || 0);
  return {
    total: {
      current: totalCoins,
      needed: reward.cost,
      gap: Math.max(0, reward.cost - totalCoins),
      ready: totalCoins >= reward.cost
    },
    // Keep individual subject data for display
    spelling: { current: gameData.spelling?.coins || 0 },
    maths: { current: gameData.maths?.coins || 0 },
    science: { current: gameData.science?.coins || 0 },
    history: { current: gameData.history?.coins || 0 }
  };
};

// Determine tier based on reward cost
const getRewardTier = (cost) => {
  if (cost <= 300) return { tier: 1, name: 'Starter', requirements: { spelling: 0, maths: 0, science: 0, history: 0 } };
  if (cost <= 700) return { tier: 2, name: 'Bronze', requirements: { spelling: 100, maths: 100, science: 0, history: 0 } }; // 2 subjects
  if (cost <= 1500) return { tier: 3, name: 'Silver', requirements: { spelling: 250, maths: 250, science: 250, history: 250 } }; // All 4
  if (cost <= 3500) return { tier: 4, name: 'Gold', requirements: { spelling: 500, maths: 500, science: 500, history: 500 } };
  if (cost <= 7000) return { tier: 5, name: 'Platinum', requirements: { spelling: 1000, maths: 1000, science: 1000, history: 1000 } };
  return { tier: 6, name: 'Diamond', requirements: { spelling: 2500, maths: 2500, science: 2500, history: 2500 } };
};

// Check if reward tier is unlocked
const isRewardUnlocked = (reward, gameData) => {
  const tierInfo = getRewardTier(reward.cost);
  const { requirements } = tierInfo;

  // Check if player has earned enough total coins in each required subject
  const spellingEarned = gameData.spelling?.totalCoinsEarned || 0;
  const mathsEarned = gameData.maths?.totalCoinsEarned || 0;
  const scienceEarned = gameData.science?.totalCoinsEarned || 0;
  const historyEarned = gameData.history?.totalCoinsEarned || 0;

  return spellingEarned >= requirements.spelling &&
         mathsEarned >= requirements.maths &&
         scienceEarned >= requirements.science &&
         historyEarned >= requirements.history;
};

// Get progress toward unlocking a reward
const getUnlockProgress = (reward, gameData) => {
  const tierInfo = getRewardTier(reward.cost);
  const { requirements } = tierInfo;

  const spellingEarned = gameData.spelling?.totalCoinsEarned || 0;
  const mathsEarned = gameData.maths?.totalCoinsEarned || 0;
  const scienceEarned = gameData.science?.totalCoinsEarned || 0;

  return {
    tier: tierInfo.tier,
    tierName: tierInfo.name,
    spelling: { current: spellingEarned, needed: requirements.spelling, met: spellingEarned >= requirements.spelling },
    maths: { current: mathsEarned, needed: requirements.maths, met: mathsEarned >= requirements.maths },
    science: { current: scienceEarned, needed: requirements.science, met: scienceEarned >= requirements.science },
    unlocked: spellingEarned >= requirements.spelling && mathsEarned >= requirements.maths && scienceEarned >= requirements.science
  };
};

const badges = [
  // ========== GETTING STARTED ==========
  { id: 'first', name: 'First Steps', icon: '👣', desc: 'Complete your first test' },
  { id: 'first5', name: 'Warming Up', icon: '🌡️', desc: 'Complete 5 tests' },
  { id: 'comeback', name: 'Back Again', icon: '🔄', desc: 'Return after a day off' },

  // ========== PERFECT SCORES ==========
  { id: 'perfect', name: 'Perfect Score', icon: '⭐', desc: 'Get 100% on a test' },
  { id: 'perfect3', name: 'Hat Trick', icon: '🎩', desc: '3 perfect scores' },
  { id: 'perfect5', name: 'High Five', icon: '🖐️', desc: '5 perfect scores' },
  { id: 'perfect10', name: 'Perfect Ten', icon: '💯', desc: '10 perfect scores' },
  { id: 'perfect15', name: 'Fifteen Flawless', icon: '🎀', desc: '15 perfect scores' },
  { id: 'perfect25', name: 'Quarter Century', icon: '🎯', desc: '25 perfect scores' },
  { id: 'perfect50', name: 'Half Century', icon: '🏹', desc: '50 perfect scores' },
  { id: 'perfect75', name: 'Three Quarters', icon: '🎪', desc: '75 perfect scores' },
  { id: 'perfect100', name: 'Centurion', icon: '🦅', desc: '100 perfect scores' },
  { id: 'perfect150', name: 'Spelling Sage', icon: '🧙‍♀️', desc: '150 perfect scores' },
  { id: 'perfect200', name: 'Word Wizard', icon: '✨', desc: '200 perfect scores' },

  // ========== STREAKS ==========
  { id: 'streak3', name: 'Streak Starter', icon: '🔥', desc: '3-day streak' },
  { id: 'streak5', name: 'Five Alive', icon: '🖐️', desc: '5-day streak' },
  { id: 'streak7', name: 'Week Warrior', icon: '💪', desc: '1-week streak' },
  { id: 'streak10', name: 'Ten Days Strong', icon: '🔟', desc: '10-day streak' },
  { id: 'streak14', name: 'Fortnight Fighter', icon: '⚔️', desc: '2-week streak' },
  { id: 'streak21', name: 'Triple Week', icon: '🏆', desc: '3-week streak' },
  { id: 'streak28', name: 'Month Master', icon: '👑', desc: '4-week streak' },
  { id: 'streak35', name: 'Five Week Fury', icon: '⚡', desc: '35-day streak' },
  { id: 'streak45', name: 'Six Week Star', icon: '🌟', desc: '45-day streak' },
  { id: 'streak60', name: 'Two Month Hero', icon: '🦸', desc: '60-day streak' },
  { id: 'streak75', name: 'Seventy Five', icon: '💎', desc: '75-day streak' },
  { id: 'streak90', name: 'Quarter Year', icon: '🌙', desc: '90-day streak' },
  { id: 'streak100', name: 'Century Streak', icon: '💯', desc: '100-day streak!' },
  { id: 'streak120', name: 'Four Month Legend', icon: '🔮', desc: '120-day streak' },
  { id: 'streak150', name: 'Five Month Fire', icon: '🌋', desc: '150-day streak' },
  { id: 'streak180', name: 'Half Year Hero', icon: '☀️', desc: '180-day streak' },
  { id: 'streak200', name: 'Two Hundred', icon: '🎊', desc: '200-day streak!' },
  { id: 'streak270', name: 'Nine Month Master', icon: '💫', desc: '270-day streak' },
  { id: 'streak300', name: 'Three Hundred', icon: '🏅', desc: '300-day streak!' },
  { id: 'streak365', name: 'YEAR CHAMPION', icon: '👸', desc: '365-day streak!' },

  // ========== COIN MILESTONES ==========
  { id: 'century', name: 'Century Club', icon: '💰', desc: 'Earn 100 coins' },
  { id: 'coins250', name: 'Coin Starter', icon: '🪙', desc: 'Earn 250 coins' },
  { id: 'coins500', name: 'Coin Collector', icon: '💎', desc: 'Earn 500 coins' },
  { id: 'coins750', name: 'Treasure Seeker', icon: '🗝️', desc: 'Earn 750 coins' },
  { id: 'coins1000', name: 'Treasure Hunter', icon: '🏴‍☠️', desc: 'Earn 1,000 coins' },
  { id: 'coins1500', name: 'Coin Hoarder', icon: '🏺', desc: 'Earn 1,500 coins' },
  { id: 'coins2000', name: 'Gold Digger', icon: '⛏️', desc: 'Earn 2,000 coins' },
  { id: 'coins2500', name: 'Money Bags', icon: '💵', desc: 'Earn 2,500 coins' },
  { id: 'coins3000', name: 'Cash Queen', icon: '👑', desc: 'Earn 3,000 coins' },
  { id: 'coins4000', name: 'Fortune Seeker', icon: '🔮', desc: 'Earn 4,000 coins' },
  { id: 'coins5000', name: 'Gold Rush', icon: '🥇', desc: 'Earn 5,000 coins' },
  { id: 'coins7500', name: 'Wealthy', icon: '💎', desc: 'Earn 7,500 coins' },
  { id: 'coins10000', name: 'Ten Thousand', icon: '🤑', desc: 'Earn 10,000 coins' },
  { id: 'coins12500', name: 'Richie Rich', icon: '🎰', desc: 'Earn 12,500 coins' },
  { id: 'coins15000', name: 'Fortune Finder', icon: '💸', desc: 'Earn 15,000 coins' },
  { id: 'coins17500', name: 'Gold Vault', icon: '🏦', desc: 'Earn 17,500 coins' },
  { id: 'coins20000', name: 'Mega Rich', icon: '💲', desc: 'Earn 20,000 coins' },
  { id: 'coins25000', name: 'Quarter Million', icon: '🌟', desc: 'Earn 25,000 coins!' },
  { id: 'coins30000', name: 'COIN QUEEN', icon: '👸', desc: 'Earn 30,000 coins!' },

  // ========== TEST MILESTONES ==========
  { id: 'tests5', name: 'First Few', icon: '📝', desc: '5 tests' },
  { id: 'tests10', name: 'Getting Started', icon: '📚', desc: '10 tests' },
  { id: 'tests15', name: 'Building Momentum', icon: '🎈', desc: '15 tests' },
  { id: 'tests25', name: 'Committed', icon: '📖', desc: '25 tests' },
  { id: 'tests40', name: 'Keep Going', icon: '🚶', desc: '40 tests' },
  { id: 'tests50', name: 'Dedicated', icon: '🧙', desc: '50 tests' },
  { id: 'tests75', name: 'Seventy Five', icon: '🎯', desc: '75 tests' },
  { id: 'tests100', name: 'Century', icon: '🏅', desc: '100 tests' },
  { id: 'tests125', name: 'Quarter Plus', icon: '📈', desc: '125 tests' },
  { id: 'tests150', name: 'Unstoppable', icon: '🚀', desc: '150 tests' },
  { id: 'tests175', name: 'Nearly There', icon: '🎪', desc: '175 tests' },
  { id: 'tests200', name: 'Super Speller', icon: '⚡', desc: '200 tests' },
  { id: 'tests225', name: 'Word Expert', icon: '📕', desc: '225 tests' },
  { id: 'tests250', name: 'Elite', icon: '🎖️', desc: '250 tests' },
  { id: 'tests275', name: 'Almost Legend', icon: '🌅', desc: '275 tests' },
  { id: 'tests300', name: 'Legendary', icon: '👨‍🎓', desc: '300 tests' },
  { id: 'tests325', name: 'Word Master', icon: '📜', desc: '325 tests' },
  { id: 'tests350', name: 'Nearly Champion', icon: '🎉', desc: '350 tests' },
  { id: 'tests365', name: 'YEAR OF SPELLING', icon: '📅', desc: '365 tests!' },
  { id: 'tests400', name: 'Beyond Legend', icon: '🌌', desc: '400 tests!' },

  // ========== CATEGORY MASTERY (All 10 categories) ==========
  { id: 'master_tricky', name: 'Tricky Master', icon: '🎭', desc: '90% on tricky words' },
  { id: 'master_ibeforee', name: 'I Before E Expert', icon: '👁️', desc: '90% on i-before-e' },
  { id: 'master_softc', name: 'Soft C Specialist', icon: '🐱', desc: '90% on soft-c words' },
  { id: 'master_double', name: 'Double Trouble', icon: '✌️', desc: '90% on double letters' },
  { id: 'master_silent', name: 'Silent Hero', icon: '🤫', desc: '90% on silent letters' },
  { id: 'master_endings', name: 'Ending Expert', icon: '🔚', desc: '90% on word endings' },
  { id: 'master_homophones', name: 'Sound Alike Pro', icon: '👂', desc: '90% on homophones' },
  { id: 'master_hard', name: 'Challenge Champion', icon: '💪', desc: '90% on hard spellings' },
  { id: 'master_prefixes', name: 'Prefix Pro', icon: '🔤', desc: '90% on prefixes' },
  { id: 'master_suffixes', name: 'Suffix Star', icon: '✨', desc: '90% on suffixes' },
  { id: 'master_compound', name: 'Compound King', icon: '🔗', desc: '90% on compound words' },
  { id: 'master_plurals', name: 'Plural Perfectionist', icon: '🔢', desc: '90% on tricky plurals' },
  { id: 'master_pasttense', name: 'Past Tense Pro', icon: '⏰', desc: '90% on past tense' },

  // ========== SPECIAL ACHIEVEMENTS ==========
  { id: 'speedster', name: 'Speedster', icon: '⚡', desc: 'Complete test in under 30s' },
  { id: 'patient', name: 'Patient Speller', icon: '🐢', desc: 'Take your time (2+ mins)' },
  { id: 'earlybird', name: 'Early Bird', icon: '🐦', desc: 'Test before 8am' },
  { id: 'nightowl', name: 'Night Owl', icon: '🦉', desc: 'Test after 8pm' },
  { id: 'weekend', name: 'Weekend Warrior', icon: '🎮', desc: 'Test on Saturday & Sunday' },
  { id: 'hotstreak5', name: 'Hot Streak', icon: '🔥', desc: '5 correct in a row (in-test)' },
  { id: 'allcorrect3', name: 'Triple Perfect', icon: '🎯', desc: '3 perfect tests in a row' },
  { id: 'allcorrect5', name: 'Five Star', icon: '⭐', desc: '5 perfect tests in a row' },
  { id: 'firsttry', name: 'First Try Hero', icon: '🏆', desc: 'Get word right you got wrong before' },

  // ========== MILESTONE ACHIEVEMENTS ==========
  { id: 'allrounder', name: 'All-Rounder', icon: '🌈', desc: '75%+ in 5 categories' },
  { id: 'versatile', name: 'Versatile', icon: '🎨', desc: '80%+ in 7 categories' },
  { id: 'mastery', name: 'Category Master', icon: '🏆', desc: '85%+ in all categories' },
  { id: 'perfectionist', name: 'Perfectionist', icon: '💎', desc: '90%+ in all categories' },
  { id: 'ultimate', name: 'ULTIMATE SPELLER', icon: '👸', desc: '95%+ in all categories!' },

  // ========== FUN BADGES ==========
  { id: 'consistent', name: 'Consistent', icon: '📊', desc: 'Same score 3 tests in a row' },
  { id: 'improver', name: 'Improver', icon: '📈', desc: 'Beat your average by 20%' },
  { id: 'determined', name: 'Determined', icon: '💪', desc: 'Keep trying after 3 wrong' },
  { id: 'curious', name: 'Curious', icon: '🔍', desc: 'Try all 10 word categories' },
  { id: 'collector', name: 'Badge Collector', icon: '🎖️', desc: 'Earn 25 badges' },
  { id: 'halfbadges', name: 'Halfway Hero', icon: '🌗', desc: 'Earn 50% of all badges' },
  { id: 'badgemaster', name: 'Badge Master', icon: '🏅', desc: 'Earn 75% of all badges' },

  // ========== HISTORY BADGES ==========
  { id: 'history-novice', name: 'History Novice', icon: '📜', desc: 'Complete 10 history tests' },
  { id: 'history-scholar', name: 'History Scholar', icon: '🏛️', desc: 'Complete 25 history tests' },
  { id: 'history-expert', name: 'History Expert', icon: '📚', desc: 'Complete 50 history tests' },
  { id: 'history-master', name: 'History Master', icon: '👑', desc: '90%+ accuracy in history' },
  { id: 'time-traveler', name: 'Time Traveler', icon: '⏳', desc: 'Try all 9 history topics' },
  { id: 'roman-scholar', name: 'Roman Scholar', icon: '🏛️', desc: 'Master Romans topic' },
  { id: 'viking-warrior', name: 'Viking Warrior', icon: '⚔️', desc: 'Master Vikings topic' },
  { id: 'tudor-expert', name: 'Tudor Expert', icon: '👑', desc: 'Master Tudors topic' },
  { id: 'ww-hero', name: 'War Hero', icon: '🎖️', desc: 'Master both World Wars' },
  { id: 'ancient-ace', name: 'Ancient Ace', icon: '🏺', desc: 'Master Egypt & Greece' },
];

const categoryNames = {
  'tricky': 'Tricky Words',
  'i-before-e': 'I Before E',
  'soft-c': 'Soft C Words',
  'double-letters': 'Double Letters',
  'silent-letters': 'Silent Letters',
  'endings': 'Word Endings',
  'homophones': 'Sound-Alike Words',
  'hard-spellings': 'Challenge Words',
  'prefixes': 'Prefixes',
  'suffixes': 'Suffixes',
  'compound': 'Compound Words',
  'plurals': 'Tricky Plurals',
  'past-tense': 'Past Tense'
};

const englishTopicNames = {
  'spelling': 'Spelling',
  'reading': 'Reading Comprehension',
  'grammar': 'Grammar & Punctuation',
  'vocabulary': 'Vocabulary'
};

const mathsTopicNames = {
  'times-tables': 'Times Tables',
  'addition': 'Addition',
  'subtraction': 'Subtraction',
  'division': 'Division',
  'fractions': 'Fractions',
  'decimals': 'Decimals',
  'measurements': 'Measurements',
  'shapes': 'Shapes',
  'ratio': 'Ratio & Proportion',
  'algebra': 'Algebra',
  'coordinates': 'Coordinates',
  'statistics': 'Data & Statistics'
};

const scienceTopicNames = {
  'states-of-matter': 'States of Matter',
  'life-cycles': 'Life Cycles',
  'forces-motion': 'Forces & Motion',
  'light-shadows': 'Light & Shadows',
  'earth-space': 'Earth & Space',
  'plants': 'Plants',
  'animals': 'Animals',
  'human-body': 'Human Body',
  'materials': 'Materials',
  'electricity': 'Electricity',
  'circulatory': 'Circulatory System',
  'circuits': 'Circuit Diagrams',
  'evolution': 'Evolution & Inheritance'
};

const historyTopicNames = {
  'romans': 'Romans in Britain',
  'anglo-saxons-vikings': 'Anglo-Saxons & Vikings',
  'tudors': 'The Tudors',
  'stuarts': 'The Stuarts',
  'victorians': 'The Victorians',
  'ww1': 'World War I',
  'ww2': 'World War II',
  'ancient-egypt': 'Ancient Egypt',
  'ancient-greece': 'Ancient Greece'
};

// ============ STORAGE HELPERS ============
const STORAGE_KEY = 'alba_spelling_data';

const getDefaultData = () => ({
  streak: 0,
  bestStreak: 0,
  lastTestDate: null,
  earnedBadges: [],
  claimedRewards: [],
  currentSubject: 'spelling', // Track which subject is active
  goals: [
    // Default goal for Alba
    {
      id: 'default-streak',
      type: 'streak',
      subject: 'all',
      target: 7,
      current: 0,
      description: 'Build a 7-day learning streak',
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      status: 'active',
      reward: 'Extra screen time'
    }
  ],
  parentNotes: [], // Parent observation notes
  spelling: {
    coins: 0,
    totalCoinsEarned: 0,
    testHistory: [],
    wordStats: {}, // { wordId: { attempts: 0, correct: 0, lastAttempt: date } }
  },
  maths: {
    coins: 0,
    totalCoinsEarned: 0,
    testHistory: [],
    questionStats: {}, // { questionId: { attempts: 0, correct: 0, lastAttempt: date } }
  },
  science: {
    coins: 0,
    totalCoinsEarned: 0,
    testHistory: [],
    questionStats: {}, // { questionId: { attempts: 0, correct: 0, lastAttempt: date } }
  },
  history: {
    coins: 0,
    totalCoinsEarned: 0,
    testHistory: [],
    questionStats: {}, // { questionId: { attempts: 0, correct: 0, lastAttempt: date } }
  },
});

// Migration function to convert old single-subject data to multi-subject
const migrateToMultiSubject = (oldData) => {
  // Check if already migrated to per-subject coins
  if (oldData.spelling?.coins !== undefined) {
    console.log('✅ Data already migrated to per-subject coins');
    return oldData;
  }

  // Migrate old data structure (move global coins to spelling.coins)
  const transferredCoins = oldData.coins || 0;
  const transferredTotal = oldData.totalCoinsEarned || 0;

  console.log('🔄 MIGRATING TO PER-SUBJECT COIN SYSTEM:', {
    globalCoinsFound: transferredCoins,
    globalTotalFound: transferredTotal,
    transferringTo: 'spelling',
    testHistoryLength: oldData.testHistory?.length || 0,
    wordStatsCount: Object.keys(oldData.wordStats || {}).length
  });

  const migrated = {
    ...getDefaultData(),
    streak: oldData.streak || 0,
    bestStreak: oldData.bestStreak || 0,
    lastTestDate: oldData.lastTestDate || null,
    earnedBadges: oldData.earnedBadges || [],
    claimedRewards: oldData.claimedRewards || [],
    currentSubject: oldData.currentSubject || 'spelling',
    spelling: {
      coins: transferredCoins,
      totalCoinsEarned: transferredTotal,
      testHistory: oldData.testHistory || [],
      wordStats: oldData.wordStats || {},
    },
    maths: {
      coins: 0,
      totalCoinsEarned: 0,
      testHistory: [],
      questionStats: {},
    },
    science: {
      coins: 0,
      totalCoinsEarned: 0,
      testHistory: [],
      questionStats: {},
    },
  };

  console.log('✅ Migration complete. New coin balances:', {
    spelling: migrated.spelling.coins,
    maths: migrated.maths.coins,
    science: migrated.science.coins
  });

  return migrated;
};

// GIST IS THE ONLY SOURCE OF TRUTH - NO LOCAL STORAGE
// Load returns default, actual data loaded async from Gist in useEffect
const loadData = () => {
  return getDefaultData();
};

// Save data DIRECTLY to Gist - no localStorage, no debounce
const saveData = (data) => {
  syncToGist(data);
};

// Sync data to GitHub Gist - THIS IS THE ONLY STORAGE
const syncToGist = (data) => {
  const token = CONFIG.GITHUB_TOKEN;
  const gistId = CONFIG.LIVE_GIST_ID;
  if (!token || !gistId) return;

  fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        'alba-spelling-data.json': {
          content: JSON.stringify(data, null, 2)
        }
      }
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('✅ Saved to Gist');
    } else {
      console.error('❌ Gist save failed:', response.status);
    }
  })
  .catch(error => {
    console.error('❌ Gist save error:', error);
  });
};

// ============ DYSLEXIA-FRIENDLY HELPERS ============
// Check if two words are visually too similar (confusing for dyslexia)
const areVisuallySimilar = (word1, word2) => {
  // Same length and 80%+ letters match = too similar
  if (Math.abs(word1.length - word2.length) > 2) return false;

  const w1 = word1.toLowerCase();
  const w2 = word2.toLowerCase();
  const maxLen = Math.max(w1.length, w2.length);
  let matches = 0;

  for (let i = 0; i < Math.min(w1.length, w2.length); i++) {
    if (w1[i] === w2[i]) matches++;
  }

  return (matches / maxLen) > 0.75; // 75%+ similar = confusing
};

// ============ SMART WORD SELECTION ============
const selectSmartWords = (gameData, count = 5) => {
  // Support per-subject data structure (spelling/maths/science)
  const subjectData = gameData.spelling || { wordStats: {}, testHistory: [] };
  const { wordStats = {}, testHistory = [] } = subjectData;

  // Every 3rd test, do a RANDOM selection for variety
  const testCount = testHistory?.length || 0;
  if (testCount > 0 && testCount % 3 === 0) {
    // Pure random selection with category variety (but still avoid visually similar words)
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    const selected = [];
    const usedCategories = new Set();
    for (const word of shuffled) {
      if (selected.length >= count) break;
      if (selected.length < 3 && usedCategories.has(word.category)) continue;

      // DYSLEXIA-FRIENDLY: Skip if too similar to already selected words
      const tooSimilar = selected.some(w => areVisuallySimilar(w.word, word.word));
      if (tooSimilar) continue;

      selected.push(word);
      usedCategories.add(word.category);
    }
    while (selected.length < count && shuffled.length > selected.length) {
      const remaining = shuffled.filter(w =>
        !selected.includes(w) &&
        !selected.some(s => areVisuallySimilar(s.word, w.word))
      );
      if (remaining.length === 0) break;
      selected.push(remaining[0]);
    }
    return selected;
  }

  // Calculate category accuracy
  const categoryAccuracy = {};
  Object.keys(categoryNames).forEach(cat => {
    categoryAccuracy[cat] = { correct: 0, total: 0 };
  });

  testHistory.forEach(test => {
    test.words?.forEach(w => {
      if (categoryAccuracy[w.category]) {
        categoryAccuracy[w.category].total++;
        if (w.correct) categoryAccuracy[w.category].correct++;
      }
    });
  });

  // Score each word (lower = needs more practice)
  const scoredWords = allWords.map(word => {
    const stats = wordStats[word.id] || { attempts: 0, correct: 0, consecutiveCorrect: 0 };
    const catStats = categoryAccuracy[word.category] || { correct: 0, total: 0 };
    const catAccuracy = catStats.total > 0 ? catStats.correct / catStats.total : 0.5;
    const wordAccuracy = stats.attempts > 0 ? stats.correct / stats.attempts : 0.5;

    // Lower score = higher priority (needs practice)
    let score = wordAccuracy * 0.4 + catAccuracy * 0.2;

    // Boost never-attempted words significantly
    if (stats.attempts === 0) score -= 0.5;

    // Boost words from weak categories
    if (catAccuracy < 0.5) score -= 0.15;

    // MASTERY SYSTEM: Penalize mastered words (reduce frequency)
    const consecutive = stats.consecutiveCorrect || 0;
    if (consecutive >= 5) score += 1.5; // Fully mastered - rarely show (90% less)
    else if (consecutive >= 3) score += 0.8; // Mastered - show less (70% less)

    // MUCH more randomness to prevent repetition (0.6 instead of 0.3)
    score += Math.random() * 0.6;

    return { ...word, score };
  });

  // Sort by score (lowest first = needs most practice)
  scoredWords.sort((a, b) => a.score - b.score);

  // Take top candidates but ensure category variety AND avoid visually similar words (dyslexia-friendly)
  const selected = [];
  const usedCategories = new Set();

  for (const word of scoredWords) {
    if (selected.length >= count) break;

    // Prefer variety in first 3 picks
    if (selected.length < 3 && usedCategories.has(word.category)) continue;

    // DYSLEXIA-FRIENDLY: Skip if too similar to already selected words
    const tooSimilar = selected.some(w => areVisuallySimilar(w.word, word.word));
    if (tooSimilar) continue;

    selected.push(word);
    usedCategories.add(word.category);
  }

  // Fill remaining slots if needed (also check for visual similarity)
  while (selected.length < count) {
    const remaining = scoredWords.filter(w =>
      !selected.includes(w) &&
      !selected.some(s => areVisuallySimilar(s.word, w.word))
    );
    if (remaining.length === 0) break;
    selected.push(remaining[0]);
  }

  // Shuffle final selection
  return selected.sort(() => Math.random() - 0.5);
};

// ============ SMART TOPIC ROUTING ============
// Get stats for a specific topic
const getTopicStats = (subject, topicKey, gameData) => {
  const subjectData = gameData[subject];
  const statsField = subject === 'spelling' ? 'wordStats' : 'questionStats';
  const stats = subjectData?.[statsField] || {};

  const questionPool = subject === 'spelling' ? allWords :
                       subject === 'maths' ? mathsQuestions :
                       subject === 'science' ? scienceQuestions :
                       historyQuestions;

  const topicQuestions = questionPool.filter(q =>
    q.topic === topicKey || q.category === topicKey
  );

  let attempts = 0, correct = 0, lastDate = null;

  topicQuestions.forEach(q => {
    const stat = stats[q.id];
    if (stat) {
      attempts += stat.attempts;
      correct += stat.correct;
      if (stat.lastAttempt && (!lastDate || new Date(stat.lastAttempt) > new Date(lastDate))) {
        lastDate = stat.lastAttempt;
      }
    }
  });

  return {
    accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
    attempts,
    lastDate,
    questionCount: topicQuestions.length
  };
};

// Get recommended topic based on performance
const getTodaysPick = (subject, gameData) => {
  const topicNames = subject === 'spelling' ? englishTopicNames :
                     subject === 'maths' ? mathsTopicNames :
                     subject === 'science' ? scienceTopicNames :
                     historyTopicNames;

  const topics = Object.keys(topicNames).map(key => ({
    key,
    name: topicNames[key],
    stats: getTopicStats(subject, key, gameData)
  }));

  // Priority 1: Weakest topic (<75% with 3+ attempts)
  const needsWork = topics
    .filter(t => t.stats.attempts >= 3 && t.stats.accuracy < 75)
    .sort((a, b) => a.stats.accuracy - b.stats.accuracy);

  if (needsWork.length > 0) {
    return {
      topic: needsWork[0],
      reason: `Let's improve this to 75%!`,
      badge: needsWork[0].stats.accuracy < 50 ? 'Focus' : 'Practice'
    };
  }

  // Priority 2: New topics (never attempted)
  const newTopics = topics.filter(t => t.stats.attempts === 0);
  if (newTopics.length > 0) {
    return {
      topic: newTopics[0],
      reason: "Ready for something new?",
      badge: 'New!'
    };
  }

  // Priority 3: Neglected (not done in 7+ days)
  const neglected = topics
    .filter(t => t.stats.lastDate && daysSince(t.stats.lastDate) >= 7)
    .sort((a, b) => daysSince(b.stats.lastDate) - daysSince(a.stats.lastDate));

  if (neglected.length > 0) {
    return {
      topic: neglected[0],
      reason: "Haven't practiced in a while!",
      badge: 'Review'
    };
  }

  return null; // All topics mastered or no data
};

// Helper: days since date
const daysSince = (dateString) => {
  if (!dateString) return 999;
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const selectSmartMathsQuestions = (gameData, count = 5, topicFilter = null) => {
  const mathsData = gameData.maths || { questionStats: {}, testHistory: [] };
  const { questionStats, testHistory } = mathsData;

  // Filter questions by topic if specified
  const questionsPool = topicFilter
    ? mathsQuestions.filter(q => q.topic === topicFilter)
    : mathsQuestions;

  // If topic filter yields too few questions, just shuffle and return
  if (questionsPool.length <= count) {
    return [...questionsPool].sort(() => Math.random() - 0.5);
  }

  // Every 3rd test, do a RANDOM selection for variety (only when no topic filter)
  const testCount = testHistory?.length || 0;
  if (!topicFilter && testCount > 0 && testCount % 3 === 0) {
    const shuffled = [...questionsPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Calculate topic accuracy
  const topicAccuracy = {};
  mathsCategories.forEach(cat => {
    topicAccuracy[cat.id] = { correct: 0, total: 0 };
  });

  testHistory.forEach(test => {
    test.words?.forEach(q => {
      if (topicAccuracy[q.category]) {
        topicAccuracy[q.category].total++;
        if (q.correct) topicAccuracy[q.category].correct++;
      }
    });
  });

  // Score each question (lower = needs more practice)
  const scoredQuestions = questionsPool.map(question => {
    const stats = questionStats[question.id] || { attempts: 0, correct: 0, consecutiveCorrect: 0 };
    const topicStats = topicAccuracy[question.topic] || { correct: 0, total: 0 };
    const topicAcc = topicStats.total > 0 ? topicStats.correct / topicStats.total : 0.5;
    const questionAcc = stats.attempts > 0 ? stats.correct / stats.attempts : 0.5;

    // Lower score = higher priority
    let score = questionAcc * 0.4 + topicAcc * 0.2;

    // Boost never-attempted questions
    if (stats.attempts === 0) score -= 0.5;

    // Boost questions from weak topics
    if (topicAcc < 0.5) score -= 0.15;

    // MASTERY SYSTEM: Penalize mastered questions
    const consecutive = stats.consecutiveCorrect || 0;
    if (consecutive >= 5) score += 1.5;
    else if (consecutive >= 3) score += 0.8;

    // Add randomness
    score += Math.random() * 0.6;

    return { ...question, score };
  });

  // Sort by score (lowest first)
  scoredQuestions.sort((a, b) => a.score - b.score);

  // Take top candidates with topic variety
  const selected = [];
  const usedTopics = new Set();

  for (const question of scoredQuestions) {
    if (selected.length >= count) break;

    // Prefer variety in first 3 picks
    if (selected.length < 3 && usedTopics.has(question.topic)) continue;

    selected.push(question);
    usedTopics.add(question.topic);
  }

  // Fill remaining slots if needed
  while (selected.length < count && scoredQuestions.length > selected.length) {
    const remaining = scoredQuestions.filter(q => !selected.includes(q));
    if (remaining.length === 0) break;
    selected.push(remaining[0]);
  }

  // Shuffle final selection
  return selected.sort(() => Math.random() - 0.5);
};

const selectSmartScienceQuestions = (gameData, count = 5, topicFilter = null) => {
  const scienceData = gameData.science || { questionStats: {}, testHistory: [] };
  const { questionStats, testHistory } = scienceData;

  // Filter questions by topic if specified
  const questionsPool = topicFilter
    ? scienceQuestions.filter(q => q.topic === topicFilter)
    : scienceQuestions;

  // If topic filter yields too few questions, just shuffle and return
  if (questionsPool.length <= count) {
    return [...questionsPool].sort(() => Math.random() - 0.5);
  }

  // Every 3rd test, do a RANDOM selection for variety (only when no topic filter)
  const testCount = testHistory?.length || 0;
  if (!topicFilter && testCount > 0 && testCount % 3 === 0) {
    const shuffled = [...questionsPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Calculate topic accuracy
  const topicAccuracy = {};
  scienceCategories.forEach(cat => {
    topicAccuracy[cat.id] = { correct: 0, total: 0 };
  });

  testHistory.forEach(test => {
    test.words?.forEach(q => {
      if (topicAccuracy[q.category]) {
        topicAccuracy[q.category].total++;
        if (q.correct) topicAccuracy[q.category].correct++;
      }
    });
  });

  // Score each question (lower = needs more practice)
  const scoredQuestions = questionsPool.map(question => {
    const stats = questionStats[question.id] || { attempts: 0, correct: 0, consecutiveCorrect: 0 };
    const topicStats = topicAccuracy[question.topic] || { correct: 0, total: 0 };
    const topicAcc = topicStats.total > 0 ? topicStats.correct / topicStats.total : 0.5;
    const questionAcc = stats.attempts > 0 ? stats.correct / stats.attempts : 0.5;

    // Lower score = higher priority
    let score = questionAcc * 0.4 + topicAcc * 0.2;

    // Boost never-attempted questions
    if (stats.attempts === 0) score -= 0.5;

    // Boost questions from weak topics
    if (topicAcc < 0.5) score -= 0.15;

    // MASTERY SYSTEM: Penalize mastered questions
    const consecutive = stats.consecutiveCorrect || 0;
    if (consecutive >= 5) score += 1.5;
    else if (consecutive >= 3) score += 0.8;

    // Add randomness
    score += Math.random() * 0.6;

    return { ...question, score };
  });

  // Sort by score (lowest first)
  scoredQuestions.sort((a, b) => a.score - b.score);

  // Take top candidates with topic variety
  const selected = [];
  const usedTopics = new Set();

  for (const question of scoredQuestions) {
    if (selected.length >= count) break;

    // Prefer variety in first 3 picks
    if (selected.length < 3 && usedTopics.has(question.topic)) continue;

    selected.push(question);
    usedTopics.add(question.topic);
  }

  // Fill remaining slots if needed
  while (selected.length < count && scoredQuestions.length > selected.length) {
    const remaining = scoredQuestions.filter(q => !selected.includes(q));
    if (remaining.length === 0) break;
    selected.push(remaining[0]);
  }

  // Shuffle final selection
  return selected.sort(() => Math.random() - 0.5);
};

// Smart question selection for History (same as Science)
const selectSmartHistoryQuestions = (gameData, count = 5, topicFilter = null) => {
  const historyData = gameData.history || { questionStats: {}, testHistory: [] };
  const { questionStats, testHistory } = historyData;

  // Filter questions by topic if specified
  const questionsPool = topicFilter
    ? historyQuestions.filter(q => q.topic === topicFilter)
    : historyQuestions;

  // If topic filter yields too few questions, just shuffle and return
  if (questionsPool.length <= count) {
    return [...questionsPool].sort(() => Math.random() - 0.5);
  }

  // Every 3rd test, do a RANDOM selection for variety (only when no topic filter)
  const testCount = testHistory?.length || 0;
  if (!topicFilter && testCount > 0 && testCount % 3 === 0) {
    const shuffled = [...questionsPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Calculate topic accuracy
  const topicAccuracy = {};
  historyCategories.forEach(cat => {
    topicAccuracy[cat.id] = { correct: 0, total: 0 };
  });

  testHistory.forEach(test => {
    test.words?.forEach(q => {
      if (topicAccuracy[q.category]) {
        topicAccuracy[q.category].total++;
        if (q.correct) topicAccuracy[q.category].correct++;
      }
    });
  });

  // Score each question (lower = needs more practice)
  const scoredQuestions = questionsPool.map(question => {
    const stats = questionStats[question.id] || { attempts: 0, correct: 0, consecutiveCorrect: 0 };
    const topicStats = topicAccuracy[question.topic] || { correct: 0, total: 0 };
    const topicAcc = topicStats.total > 0 ? topicStats.correct / topicStats.total : 0.5;
    const questionAcc = stats.attempts > 0 ? stats.correct / stats.attempts : 0.5;

    // Lower score = higher priority
    let score = questionAcc * 0.4 + topicAcc * 0.2;

    // Boost never-attempted questions
    if (stats.attempts === 0) score -= 0.5;

    // Boost questions from weak topics
    if (topicAcc < 0.5) score -= 0.15;

    // MASTERY SYSTEM: Penalize mastered questions
    const consecutive = stats.consecutiveCorrect || 0;
    if (consecutive >= 5) score += 1.5;
    else if (consecutive >= 3) score += 0.8;

    // Add randomness
    score += Math.random() * 0.6;

    return { ...question, score };
  });

  // Sort by score (lowest first)
  scoredQuestions.sort((a, b) => a.score - b.score);

  // Take top candidates with topic variety
  const selected = [];
  const usedTopics = new Set();

  for (const question of scoredQuestions) {
    if (selected.length >= count) break;

    // Prefer variety in first 3 picks
    if (selected.length < 3 && usedTopics.has(question.topic)) continue;

    selected.push(question);
    usedTopics.add(question.topic);
  }

  // Fill remaining slots if needed
  while (selected.length < count && scoredQuestions.length > selected.length) {
    const remaining = scoredQuestions.filter(q => !selected.includes(q));
    if (remaining.length === 0) break;
    selected.push(remaining[0]);
  }

  // Shuffle final selection
  return selected.sort(() => Math.random() - 0.5);
};

// ============ SPELLING MCQ HELPERS ============
// Generate 3 plausible incorrect spellings for a word
const generateIncorrectOptions = (word, category) => {
  const incorrect = new Set();
  const w = word.toLowerCase();

  // Strategy 1: Swap adjacent letters
  for (let i = 0; i < w.length - 1; i++) {
    const swapped = w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2);
    if (swapped !== w) incorrect.add(swapped);
  }

  // Strategy 2: Double a consonant or remove double
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  for (let i = 0; i < w.length; i++) {
    if (consonants.includes(w[i])) {
      // Double it
      incorrect.add(w.slice(0, i) + w[i] + w.slice(i));
      // If already doubled, remove one
      if (i < w.length - 1 && w[i] === w[i + 1]) {
        incorrect.add(w.slice(0, i) + w.slice(i + 1));
      }
    }
  }

  // Strategy 3: Common phonetic confusions
  const confusions = [
    ['ie', 'ei'], ['ei', 'ie'],
    ['c', 's'], ['s', 'c'],
    ['ph', 'f'], ['f', 'ph'],
    ['tion', 'shun'], ['sion', 'shun'],
    ['ough', 'uff'], ['ough', 'off'],
    ['ould', 'old'], ['ould', 'uld'],
    ['ght', 't'],
    ['ck', 'k'], ['k', 'ck'],
    ['qu', 'kw'],
    ['wh', 'w'],
    ['wr', 'r'],
    ['kn', 'n'],
    ['gn', 'n'],
    ['mb', 'm'],
    ['our', 'or'], ['or', 'our']
  ];
  for (const [from, to] of confusions) {
    if (w.includes(from)) {
      incorrect.add(w.replace(from, to));
    }
  }

  // Strategy 4: Missing or extra vowels
  const vowels = 'aeiou';
  for (let i = 0; i < w.length; i++) {
    if (vowels.includes(w[i])) {
      // Remove vowel
      incorrect.add(w.slice(0, i) + w.slice(i + 1));
      // Change vowel
      for (const v of vowels) {
        if (v !== w[i]) incorrect.add(w.slice(0, i) + v + w.slice(i + 1));
      }
    }
  }

  // Remove the correct word if it somehow got added
  incorrect.delete(w);

  // Convert to array and take 3 random ones
  const arr = Array.from(incorrect).filter(x => x.length > 1);
  const shuffled = arr.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

// Shuffle array helper
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ============ COMPONENTS ============
// Drawing Canvas for Maths Scratchpad
const DrawingCanvas = () => {
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [lastPos, setLastPos] = React.useState({ x: 0, y: 0 });

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    setLastPos({ x, y });
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1e40af'; // Blue
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="mb-4">
      <div className="bg-white rounded-xl p-3 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">✏️ Workings</span>
          <button onClick={clearCanvas} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-lg font-semibold active:bg-red-200">
            Clear
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={340}
          height={200}
          className="w-full border-2 border-gray-200 rounded-lg touch-none bg-gray-50"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
};

const Keyboard = ({ onKey, onBackspace, onSubmit }) => {
  return (
    <div className="mt-4 px-1">
      {/* Submit button prominent at top */}
      <div className="flex justify-center mb-3">
        <button onClick={onSubmit} className="w-full max-w-xs py-3 bg-green-500 text-white rounded-xl text-lg font-bold active:scale-98 shadow-lg">Submit ✓</button>
      </div>

      {/* Row 1: Q-P */}
      <div className="flex justify-center gap-1 mb-1">
        {['q','w','e','r','t','y','u','i','o','p'].map(k => (
          <button key={k} onClick={() => onKey(k)} className="flex-1 max-w-9 h-11 bg-gray-100 rounded-lg text-base font-semibold active:bg-gray-300 active:scale-95 uppercase shadow-sm">{k}</button>
        ))}
      </div>

      {/* Row 2: A-L with slight indent */}
      <div className="flex justify-center gap-1 mb-1 px-3">
        {['a','s','d','f','g','h','j','k','l'].map(k => (
          <button key={k} onClick={() => onKey(k)} className="flex-1 max-w-9 h-11 bg-gray-100 rounded-lg text-base font-semibold active:bg-gray-300 active:scale-95 uppercase shadow-sm">{k}</button>
        ))}
      </div>

      {/* Row 3: Z-M with backspace */}
      <div className="flex justify-center gap-1 mb-1">
        <button onClick={onBackspace} className="w-12 h-11 bg-red-100 text-red-600 rounded-lg text-sm font-bold active:bg-red-200 active:scale-95 shadow-sm">⌫</button>
        {['z','x','c','v','b','n','m'].map(k => (
          <button key={k} onClick={() => onKey(k)} className="flex-1 max-w-9 h-11 bg-gray-100 rounded-lg text-base font-semibold active:bg-gray-300 active:scale-95 uppercase shadow-sm">{k}</button>
        ))}
        <button onClick={onBackspace} className="w-12 h-11 bg-red-100 text-red-600 rounded-lg text-sm font-bold active:bg-red-200 active:scale-95 shadow-sm">⌫</button>
      </div>

      {/* Row 4: Spacebar */}
      <div className="flex justify-center gap-1">
        <button onClick={() => onKey(' ')} className="flex-1 max-w-52 h-10 bg-gray-200 rounded-lg text-sm font-semibold active:bg-gray-400 active:scale-95 shadow-sm">space</button>
      </div>
    </div>
  );
};

const NumberPad = ({ onKey, onBackspace, onSubmit, onClear }) => {
  const keys = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', '/']
  ];

  const handleKeyPress = (key) => {
    if (navigator.vibrate) navigator.vibrate(10);
    onKey(key);
  };

  const handleBackspace = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    onBackspace();
  };

  const handleClear = () => {
    if (navigator.vibrate) navigator.vibrate(15);
    onClear();
  };

  const handleSubmit = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    onSubmit();
  };

  return (
    <div className="mt-4 max-w-xs mx-auto px-2">
      {/* Submit button prominent at top */}
      <div className="flex justify-center mb-3">
        <button onClick={handleSubmit} className="w-full py-3 bg-green-500 text-white rounded-xl text-lg font-bold active:scale-98 shadow-lg">Submit ✓</button>
      </div>

      {/* Number grid with Clear/Back */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <button onClick={() => handleKeyPress('7')} className="h-14 bg-gray-100 rounded-xl text-xl font-bold active:scale-95 shadow-sm">7</button>
        <button onClick={() => handleKeyPress('8')} className="h-14 bg-gray-100 rounded-xl text-xl font-bold active:scale-95 shadow-sm">8</button>
        <button onClick={() => handleKeyPress('9')} className="h-14 bg-gray-100 rounded-xl text-xl font-bold active:scale-95 shadow-sm">9</button>
        <button onClick={handleBackspace} className="h-14 bg-red-100 text-red-600 rounded-xl text-lg font-bold active:scale-95 shadow-sm">⌫</button>

        {/* Row 2 */}
        <button onClick={() => handleKeyPress('4')} className="h-14 bg-gray-100 rounded-xl text-xl font-bold active:scale-95 shadow-sm">4</button>
        <button onClick={() => handleKeyPress('5')} className="h-14 bg-gray-100 rounded-xl text-xl font-bold active:scale-95 shadow-sm">5</button>
        <button onClick={() => handleKeyPress('6')} className="h-14 bg-gray-100 rounded-xl text-xl font-bold active:scale-95 shadow-sm">6</button>
        <button onClick={handleClear} className="h-14 bg-gray-200 text-gray-600 rounded-xl text-sm font-bold active:scale-95 shadow-sm">CLR</button>

        {/* Row 3 */}
        <button onClick={() => handleKeyPress('1')} className="h-14 bg-gray-100 rounded-xl text-xl font-bold active:scale-95 shadow-sm">1</button>
        <button onClick={() => handleKeyPress('2')} className="h-14 bg-gray-100 rounded-xl text-xl font-bold active:scale-95 shadow-sm">2</button>
        <button onClick={() => handleKeyPress('3')} className="h-14 bg-gray-100 rounded-xl text-xl font-bold active:scale-95 shadow-sm">3</button>
        <button onClick={() => handleKeyPress('/')} className="h-14 bg-blue-100 text-blue-600 rounded-xl text-xl font-bold active:scale-95 shadow-sm">/</button>

        {/* Row 4 */}
        <button onClick={() => handleKeyPress('0')} className="h-14 bg-gray-100 rounded-xl text-xl font-bold active:scale-95 shadow-sm col-span-2">0</button>
        <button onClick={() => handleKeyPress('.')} className="h-14 bg-gray-100 rounded-xl text-xl font-bold active:scale-95 shadow-sm">.</button>
        <button onClick={() => handleKeyPress('-')} className="h-14 bg-blue-100 text-blue-600 rounded-xl text-xl font-bold active:scale-95 shadow-sm">−</button>
      </div>
    </div>
  );
};

const CoinAnimation = ({ amount }) => {
  const [show, setShow] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShow(false), 1500); return () => clearTimeout(t); }, []);
  if (!show) return null;
  return <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-yellow-500 animate-bounce">+{amount} 🪙</div>;
};

const BadgePopup = ({ badge, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 text-center animate-bounce">
        <span className="text-6xl">{badge.icon}</span>
        <h2 className="text-2xl font-bold mt-4 text-gray-800">Badge Earned!</h2>
        <p className="text-xl font-semibold text-purple-600 mt-2">{badge.name}</p>
        <p className="text-gray-500 mt-1">{badge.desc}</p>
      </div>
    </div>
  );
};

// ============ MAIN APP ============
export default function App() {
  const [screen, setScreen] = useState('subject-select');
  const [gameData, setGameData] = useState(loadData);
  const [testWords, setTestWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [showResult, setShowResult] = useState(null);
  const [coinAnim, setCoinAnim] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [challengeMode, setChallengeMode] = useState(false);
  const [aiMarking, setAiMarking] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [newBadge, setNewBadge] = useState(null);
  const [hotStreak, setHotStreak] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintText, setHintText] = useState('');
  const [selectedMathsTopic, setSelectedMathsTopic] = useState('all');
  const [selectedScienceTopic, setSelectedScienceTopic] = useState('all');
  const [selectedHistoryTopic, setSelectedHistoryTopic] = useState('all');
  const [spellingMode, setSpellingMode] = useState(localStorage.getItem('spelling_mode') || 'mixed'); // 'type-in', 'multiple-choice', 'mixed'
  const [spellingMCQ, setSpellingMCQ] = useState(false); // Is current question MCQ?
  const [spellingOptions, setSpellingOptions] = useState([]); // 4 shuffled options for MCQ

  // Persist on change
  useEffect(() => { saveData(gameData); }, [gameData]);

  // Check streak on load
  useEffect(() => {
    const today = new Date().toDateString();
    const last = gameData.lastTestDate;
    if (last) {
      const lastDate = new Date(last);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastDate.toDateString() !== today && lastDate.toDateString() !== yesterday.toDateString()) {
        setGameData(prev => ({ ...prev, streak: 0 }));
      }
    }
  }, []);

  // Apply accessibility settings on load
  useEffect(() => {
    const font = localStorage.getItem('dyslexia_font');
    const textSize = localStorage.getItem('dyslexia_text_size');
    const bgColor = localStorage.getItem('dyslexia_bg');
    const lineHeight = localStorage.getItem('dyslexia_line_height');

    if (font && font !== 'default') {
      document.body.style.fontFamily = font === 'opendyslexic' ? 'OpenDyslexic, sans-serif' :
                                       font === 'comic-sans' ? 'Comic Sans MS, cursive' :
                                       font === 'lexend' ? 'Lexend, sans-serif' : '';
    }
    if (textSize) document.body.style.fontSize = textSize;
    if (bgColor) document.body.style.backgroundColor = bgColor;
    if (lineHeight) document.body.style.lineHeight = lineHeight;
  }, []);

  // Startup: Migrate localStorage to Gist if needed, then load from Gist
  useEffect(() => {
    const syncAndLoad = async () => {
      const token = CONFIG.GITHUB_TOKEN;
      const gistId = CONFIG.LIVE_GIST_ID;
      if (!token || !gistId) return;

      try {
        // Check localStorage for data that needs migrating
        const localRaw = localStorage.getItem('alba_spelling_data');
        let localData = null;
        let localCoins = 0;
        if (localRaw) {
          localData = migrateToMultiSubject(JSON.parse(localRaw));
          localCoins = (localData.spelling?.totalCoinsEarned || 0) +
                       (localData.maths?.totalCoinsEarned || 0) +
                       (localData.science?.totalCoinsEarned || 0) +
                       (localData.history?.totalCoinsEarned || 0);
          console.log('📱 Local data found:', localCoins, 'coins');
        }

        // Load from Gist
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
          headers: { 'Authorization': `token ${token}` }
        });

        let gistData = null;
        let gistCoins = 0;
        if (response.ok) {
          const gist = await response.json();
          if (gist.files['alba-spelling-data.json']) {
            gistData = migrateToMultiSubject(JSON.parse(gist.files['alba-spelling-data.json'].content));
            gistCoins = (gistData.spelling?.totalCoinsEarned || 0) +
                        (gistData.maths?.totalCoinsEarned || 0) +
                        (gistData.science?.totalCoinsEarned || 0) +
                        (gistData.history?.totalCoinsEarned || 0);
            console.log('☁️ Gist data found:', gistCoins, 'coins');
          }
        }

        // If local has MORE, push to Gist first
        if (localData && localCoins > gistCoins) {
          console.log('🔄 Pushing local data to Gist...');
          await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ files: { 'alba-spelling-data.json': { content: JSON.stringify(localData, null, 2) } } })
          });
          setGameData(localData);
          console.log('✅ Local data pushed to Gist');
        } else if (gistData) {
          setGameData(gistData);
          console.log('✅ Loaded from Gist');
        }

        // Clear localStorage - Gist is now source of truth
        localStorage.removeItem('alba_spelling_data');
      } catch (e) {
        console.error('❌ Sync error:', e);
      }
    };

    syncAndLoad();
  }, []);

  const { coins, streak, earnedBadges, totalCoinsEarned, bestStreak, claimedRewards, currentSubject, spelling, maths, science, history } = gameData;

  // Get current subject data (for backward compatibility with spelling screen)
  const testHistory = spelling.testHistory;
  const wordStats = spelling.wordStats;

  // Badge checking - comprehensive for 104 badges!
  const checkBadges = (data) => {
    const newBadges = [];
    // Aggregate test history from all subjects (multi-subject structure)
    const allTestHistory = [
      ...(data.spelling?.testHistory || []),
      ...(data.maths?.testHistory || []),
      ...(data.science?.testHistory || []),
      ...(data.history?.testHistory || [])
    ];
    const perfectTests = allTestHistory.filter(t => t.score === t.total).length;
    const testCount = allTestHistory.length;
    // Aggregate total coins from all subjects (4 currencies)
    const totalCoinsEarned = (data.spelling?.totalCoinsEarned || 0) + (data.maths?.totalCoinsEarned || 0) + (data.science?.totalCoinsEarned || 0) + (data.history?.totalCoinsEarned || 0);

    // Getting started
    if (!data.earnedBadges.includes('first') && testCount >= 1) newBadges.push('first');
    if (!data.earnedBadges.includes('first5') && testCount >= 5) newBadges.push('first5');

    // Perfect scores (11 badges)
    if (!data.earnedBadges.includes('perfect') && perfectTests >= 1) newBadges.push('perfect');
    if (!data.earnedBadges.includes('perfect3') && perfectTests >= 3) newBadges.push('perfect3');
    if (!data.earnedBadges.includes('perfect5') && perfectTests >= 5) newBadges.push('perfect5');
    if (!data.earnedBadges.includes('perfect10') && perfectTests >= 10) newBadges.push('perfect10');
    if (!data.earnedBadges.includes('perfect15') && perfectTests >= 15) newBadges.push('perfect15');
    if (!data.earnedBadges.includes('perfect25') && perfectTests >= 25) newBadges.push('perfect25');
    if (!data.earnedBadges.includes('perfect50') && perfectTests >= 50) newBadges.push('perfect50');
    if (!data.earnedBadges.includes('perfect75') && perfectTests >= 75) newBadges.push('perfect75');
    if (!data.earnedBadges.includes('perfect100') && perfectTests >= 100) newBadges.push('perfect100');
    if (!data.earnedBadges.includes('perfect150') && perfectTests >= 150) newBadges.push('perfect150');
    if (!data.earnedBadges.includes('perfect200') && perfectTests >= 200) newBadges.push('perfect200');

    // Streaks (20 badges)
    if (!data.earnedBadges.includes('streak3') && data.streak >= 3) newBadges.push('streak3');
    if (!data.earnedBadges.includes('streak5') && data.streak >= 5) newBadges.push('streak5');
    if (!data.earnedBadges.includes('streak7') && data.streak >= 7) newBadges.push('streak7');
    if (!data.earnedBadges.includes('streak10') && data.streak >= 10) newBadges.push('streak10');
    if (!data.earnedBadges.includes('streak14') && data.streak >= 14) newBadges.push('streak14');
    if (!data.earnedBadges.includes('streak21') && data.streak >= 21) newBadges.push('streak21');
    if (!data.earnedBadges.includes('streak28') && data.streak >= 28) newBadges.push('streak28');
    if (!data.earnedBadges.includes('streak35') && data.streak >= 35) newBadges.push('streak35');
    if (!data.earnedBadges.includes('streak45') && data.streak >= 45) newBadges.push('streak45');
    if (!data.earnedBadges.includes('streak60') && data.streak >= 60) newBadges.push('streak60');
    if (!data.earnedBadges.includes('streak75') && data.streak >= 75) newBadges.push('streak75');
    if (!data.earnedBadges.includes('streak90') && data.streak >= 90) newBadges.push('streak90');
    if (!data.earnedBadges.includes('streak100') && data.streak >= 100) newBadges.push('streak100');
    if (!data.earnedBadges.includes('streak120') && data.streak >= 120) newBadges.push('streak120');
    if (!data.earnedBadges.includes('streak150') && data.streak >= 150) newBadges.push('streak150');
    if (!data.earnedBadges.includes('streak180') && data.streak >= 180) newBadges.push('streak180');
    if (!data.earnedBadges.includes('streak200') && data.streak >= 200) newBadges.push('streak200');
    if (!data.earnedBadges.includes('streak270') && data.streak >= 270) newBadges.push('streak270');
    if (!data.earnedBadges.includes('streak300') && data.streak >= 300) newBadges.push('streak300');
    if (!data.earnedBadges.includes('streak365') && data.streak >= 365) newBadges.push('streak365');

    // Coin milestones (19 badges)
    if (!data.earnedBadges.includes('century') && totalCoinsEarned >= 100) newBadges.push('century');
    if (!data.earnedBadges.includes('coins250') && totalCoinsEarned >= 250) newBadges.push('coins250');
    if (!data.earnedBadges.includes('coins500') && totalCoinsEarned >= 500) newBadges.push('coins500');
    if (!data.earnedBadges.includes('coins750') && totalCoinsEarned >= 750) newBadges.push('coins750');
    if (!data.earnedBadges.includes('coins1000') && totalCoinsEarned >= 1000) newBadges.push('coins1000');
    if (!data.earnedBadges.includes('coins1500') && totalCoinsEarned >= 1500) newBadges.push('coins1500');
    if (!data.earnedBadges.includes('coins2000') && totalCoinsEarned >= 2000) newBadges.push('coins2000');
    if (!data.earnedBadges.includes('coins2500') && totalCoinsEarned >= 2500) newBadges.push('coins2500');
    if (!data.earnedBadges.includes('coins3000') && totalCoinsEarned >= 3000) newBadges.push('coins3000');
    if (!data.earnedBadges.includes('coins4000') && totalCoinsEarned >= 4000) newBadges.push('coins4000');
    if (!data.earnedBadges.includes('coins5000') && totalCoinsEarned >= 5000) newBadges.push('coins5000');
    if (!data.earnedBadges.includes('coins7500') && totalCoinsEarned >= 7500) newBadges.push('coins7500');
    if (!data.earnedBadges.includes('coins10000') && totalCoinsEarned >= 10000) newBadges.push('coins10000');
    if (!data.earnedBadges.includes('coins12500') && totalCoinsEarned >= 12500) newBadges.push('coins12500');
    if (!data.earnedBadges.includes('coins15000') && totalCoinsEarned >= 15000) newBadges.push('coins15000');
    if (!data.earnedBadges.includes('coins17500') && totalCoinsEarned >= 17500) newBadges.push('coins17500');
    if (!data.earnedBadges.includes('coins20000') && totalCoinsEarned >= 20000) newBadges.push('coins20000');
    if (!data.earnedBadges.includes('coins25000') && totalCoinsEarned >= 25000) newBadges.push('coins25000');
    if (!data.earnedBadges.includes('coins30000') && totalCoinsEarned >= 30000) newBadges.push('coins30000');

    // Test milestones (20 badges)
    if (!data.earnedBadges.includes('tests5') && testCount >= 5) newBadges.push('tests5');
    if (!data.earnedBadges.includes('tests10') && testCount >= 10) newBadges.push('tests10');
    if (!data.earnedBadges.includes('tests15') && testCount >= 15) newBadges.push('tests15');
    if (!data.earnedBadges.includes('tests25') && testCount >= 25) newBadges.push('tests25');
    if (!data.earnedBadges.includes('tests40') && testCount >= 40) newBadges.push('tests40');
    if (!data.earnedBadges.includes('tests50') && testCount >= 50) newBadges.push('tests50');
    if (!data.earnedBadges.includes('tests75') && testCount >= 75) newBadges.push('tests75');
    if (!data.earnedBadges.includes('tests100') && testCount >= 100) newBadges.push('tests100');
    if (!data.earnedBadges.includes('tests125') && testCount >= 125) newBadges.push('tests125');
    if (!data.earnedBadges.includes('tests150') && testCount >= 150) newBadges.push('tests150');
    if (!data.earnedBadges.includes('tests175') && testCount >= 175) newBadges.push('tests175');
    if (!data.earnedBadges.includes('tests200') && testCount >= 200) newBadges.push('tests200');
    if (!data.earnedBadges.includes('tests225') && testCount >= 225) newBadges.push('tests225');
    if (!data.earnedBadges.includes('tests250') && testCount >= 250) newBadges.push('tests250');
    if (!data.earnedBadges.includes('tests275') && testCount >= 275) newBadges.push('tests275');
    if (!data.earnedBadges.includes('tests300') && testCount >= 300) newBadges.push('tests300');
    if (!data.earnedBadges.includes('tests325') && testCount >= 325) newBadges.push('tests325');
    if (!data.earnedBadges.includes('tests350') && testCount >= 350) newBadges.push('tests350');
    if (!data.earnedBadges.includes('tests365') && testCount >= 365) newBadges.push('tests365');
    if (!data.earnedBadges.includes('tests400') && testCount >= 400) newBadges.push('tests400');

    // Category mastery
    const catStats = {};
    allTestHistory.forEach(test => {
      test.words?.forEach(w => {
        if (!catStats[w.category]) catStats[w.category] = { correct: 0, total: 0 };
        catStats[w.category].total++;
        if (w.correct) catStats[w.category].correct++;
      });
    });
    const getCatPct = (cat) => catStats[cat] && catStats[cat].total >= 10 ? (catStats[cat].correct / catStats[cat].total) * 100 : 0;

    // All 10 category mastery badges
    if (!data.earnedBadges.includes('master_tricky') && getCatPct('tricky') >= 90) newBadges.push('master_tricky');
    if (!data.earnedBadges.includes('master_ibeforee') && getCatPct('i-before-e') >= 90) newBadges.push('master_ibeforee');
    if (!data.earnedBadges.includes('master_softc') && getCatPct('soft-c') >= 90) newBadges.push('master_softc');
    if (!data.earnedBadges.includes('master_double') && getCatPct('double-letters') >= 90) newBadges.push('master_double');
    if (!data.earnedBadges.includes('master_silent') && getCatPct('silent-letters') >= 90) newBadges.push('master_silent');
    if (!data.earnedBadges.includes('master_endings') && getCatPct('endings') >= 90) newBadges.push('master_endings');
    if (!data.earnedBadges.includes('master_homophones') && getCatPct('homophones') >= 90) newBadges.push('master_homophones');
    if (!data.earnedBadges.includes('master_hard') && getCatPct('hard-spellings') >= 90) newBadges.push('master_hard');
    if (!data.earnedBadges.includes('master_prefixes') && getCatPct('prefixes') >= 90) newBadges.push('master_prefixes');
    if (!data.earnedBadges.includes('master_compound') && getCatPct('compound') >= 90) newBadges.push('master_compound');

    // Milestone achievements
    const catsWithAttempts = Object.keys(catStats).filter(c => catStats[c].total >= 5);
    const catsAbove75 = catsWithAttempts.filter(c => (catStats[c].correct / catStats[c].total) >= 0.75);
    const catsAbove80 = catsWithAttempts.filter(c => (catStats[c].correct / catStats[c].total) >= 0.80);
    const catsAbove85 = catsWithAttempts.filter(c => (catStats[c].correct / catStats[c].total) >= 0.85);
    const catsAbove90 = catsWithAttempts.filter(c => (catStats[c].correct / catStats[c].total) >= 0.90);
    const catsAbove95 = catsWithAttempts.filter(c => (catStats[c].correct / catStats[c].total) >= 0.95);

    if (!data.earnedBadges.includes('allrounder') && catsAbove75.length >= 5) newBadges.push('allrounder');
    if (!data.earnedBadges.includes('versatile') && catsAbove80.length >= 7) newBadges.push('versatile');
    if (!data.earnedBadges.includes('mastery') && catsAbove85.length >= 10) newBadges.push('mastery');
    if (!data.earnedBadges.includes('perfectionist') && catsAbove90.length >= 10) newBadges.push('perfectionist');
    if (!data.earnedBadges.includes('ultimate') && catsAbove95.length >= 10) newBadges.push('ultimate');

    // Curious - tried all 10 categories
    const categoriesTried = new Set();
    allTestHistory.forEach(test => { test.words?.forEach(w => categoriesTried.add(w.category)); });
    if (!data.earnedBadges.includes('curious') && categoriesTried.size >= 10) newBadges.push('curious');

    // History badges
    const historyTests = data.history?.testHistory?.length || 0;
    if (!data.earnedBadges.includes('history-novice') && historyTests >= 10) newBadges.push('history-novice');
    if (!data.earnedBadges.includes('history-scholar') && historyTests >= 25) newBadges.push('history-scholar');
    if (!data.earnedBadges.includes('history-expert') && historyTests >= 50) newBadges.push('history-expert');

    // History accuracy
    const historyTestData = data.history?.testHistory || [];
    if (historyTestData.length > 0) {
      const historyCorrect = historyTestData.reduce((sum, t) => sum + (t.questions?.filter(q => q.correct).length || 0), 0);
      const historyTotal = historyTestData.reduce((sum, t) => sum + (t.questions?.length || 0), 0);
      const historyAccuracy = historyTotal > 0 ? (historyCorrect / historyTotal) * 100 : 0;
      if (!data.earnedBadges.includes('history-master') && historyAccuracy >= 90) newBadges.push('history-master');
    }

    // History topics tried
    const historyTopicsTried = new Set();
    historyTestData.forEach(test => {
      test.questions?.forEach(q => historyTopicsTried.add(q.topic));
    });
    if (!data.earnedBadges.includes('time-traveler') && historyTopicsTried.size >= 9) newBadges.push('time-traveler');

    // Badge collection badges
    const totalBadges = data.earnedBadges.length + newBadges.length;
    if (!data.earnedBadges.includes('collector') && totalBadges >= 25) newBadges.push('collector');
    if (!data.earnedBadges.includes('halfbadges') && totalBadges >= Math.floor(badges.length / 2)) newBadges.push('halfbadges');
    if (!data.earnedBadges.includes('badgemaster') && totalBadges >= Math.floor(badges.length * 0.75)) newBadges.push('badgemaster');

    if (newBadges.length > 0) {
      setNewBadge(badges.find(b => b.id === newBadges[0]));
      return [...data.earnedBadges, ...newBadges];
    }
    return data.earnedBadges;
  };

  const speak = async (text) => {
    setSpeaking(true);
    await ttsService.speak(text, () => setSpeaking(true), () => setSpeaking(false), () => setSpeaking(false));
  };

  const startTest = () => {
    let questions;
    if (currentSubject === 'maths') {
      // Filter by topic if selected
      const topicFilter = selectedMathsTopic !== 'all' ? selectedMathsTopic : null;
      questions = selectSmartMathsQuestions(gameData, 5, topicFilter);
    } else if (currentSubject === 'spelling') {
      questions = selectSmartWords(gameData, 5);
    } else if (currentSubject === 'science') {
      // Filter by topic if selected
      const topicFilter = selectedScienceTopic !== 'all' ? selectedScienceTopic : null;
      questions = selectSmartScienceQuestions(gameData, 5, topicFilter);
    } else if (currentSubject === 'history') {
      // Filter by topic if selected
      const topicFilter = selectedHistoryTopic !== 'all' ? selectedHistoryTopic : null;
      questions = selectSmartHistoryQuestions(gameData, 5, topicFilter);
    } else {
      questions = [];
    }
    setTestWords(questions);
    setCurrentIndex(0);
    setInput('');
    setResults([]);
    setShowResult(null);
    setHotStreak(0);
    setHintUsed(false);
    setHintText('');
    setChallengeMode(false);
    setAiResponse(null);
    setQuestionStartTime(Date.now());

    // Set up spelling MCQ mode for first question
    if (currentSubject === 'spelling' && questions.length > 0) {
      const useMCQ = spellingMode === 'multiple-choice' ? true :
                     spellingMode === 'type-in' ? false :
                     Math.random() < 0.5; // mixed = 50/50
      setSpellingMCQ(useMCQ);
      if (useMCQ) {
        const incorrects = generateIncorrectOptions(questions[0].word, questions[0].category);
        setSpellingOptions(shuffleArray([questions[0].word, ...incorrects]));
      }
    } else {
      setSpellingMCQ(false);
      setSpellingOptions([]);
    }

    setScreen('test');
  };

  const handleKey = (k) => { if (showResult === null) setInput(prev => prev + k); };
  const handleBackspace = () => { if (showResult === null) setInput(prev => prev.slice(0, -1)); };

  const handleSubmit = async () => {
    if (input.trim() === '' || showResult !== null || aiMarking) return;
    const item = testWords[currentIndex];

    // Calculate response time (seconds)
    const responseTime = questionStartTime ? Math.round((Date.now() - questionStartTime) / 1000) : 0;

    // Check answer based on subject type
    let correct = false;
    let displayText = '';
    let categoryField = '';
    let bonusCoins = 0;

    if (currentSubject === 'maths') {
      // Maths: compare numeric values (support both decimals and fractions)
      const parseAnswer = (ans) => {
        if (ans.includes('/')) {
          const [num, denom] = ans.split('/').map(s => parseFloat(s.trim()));
          return (!isNaN(num) && !isNaN(denom) && denom !== 0) ? num / denom : NaN;
        }
        return parseFloat(ans);
      };

      const userAnswer = parseAnswer(input.trim());
      const correctAnswer = parseAnswer(item.answer);
      correct = !isNaN(userAnswer) && Math.abs(userAnswer - correctAnswer) < 0.01; // Allow tiny floating point differences
      displayText = item.question;
      categoryField = item.topic;
    } else if (currentSubject === 'spelling') {
      // Spelling: compare strings (case-insensitive)
      correct = input.toLowerCase().trim() === item.word.toLowerCase();
      displayText = item.word;
      categoryField = item.category;
    } else if (currentSubject === 'science') {
      displayText = item.question;
      categoryField = item.topic;

      // Challenge Mode - use AI marking
      if (challengeMode && item.acceptedConcepts) {
        setAiMarking(true);
        try {
          const result = await aiMarkingService.markAnswer(
            item.question,
            input.trim(),
            item.acceptedConcepts
          );
          correct = result.correct;
          setAiResponse(result.feedback);
          if (correct) {
            bonusCoins = 2; // Challenge Mode bonus
          }
        } catch (error) {
          console.error('AI marking failed:', error);
          // Fallback to MCQ marking if AI fails
          correct = parseInt(input) === item.answer;
          setAiResponse('AI marking unavailable - used standard marking');
        }
        setAiMarking(false);
      } else if (item.type === 'multiple-choice') {
        // Standard MCQ marking
        correct = parseInt(input) === item.answer;
      } else if (item.type === 'true-false') {
        // True/False marking
        correct = (input.toLowerCase() === 'true') === item.answer;
      }
    } else if (currentSubject === 'history') {
      displayText = item.question;
      categoryField = item.topic;

      // History uses MCQ and True/False like Science
      if (item.type === 'mcq') {
        // MCQ - check if selected option matches answer
        correct = input === item.answer;
      } else if (item.type === 'true-false') {
        // True/False marking
        correct = (input.toLowerCase() === 'true') === item.answer;
      }
    }

    // Hot streak multiplier: 1st = 1 coin, 2nd = 2 coins, 3rd+ = 3 coins
    let earned = 0;
    let newStreak = hotStreak;
    if (correct) {
      newStreak = hotStreak + 1;
      if (newStreak === 1) earned = 1;
      else if (newStreak === 2) earned = 2;
      else earned = 3; // 3+ streak

      // MASTERY SYSTEM: Reduce coins for mastered items
      let stats;
      if (currentSubject === 'spelling') {
        stats = gameData.spelling.wordStats[item.id] || { consecutiveCorrect: 0 };
      } else if (currentSubject === 'maths') {
        stats = gameData.maths.questionStats[item.id] || { consecutiveCorrect: 0 };
      } else if (currentSubject === 'science') {
        stats = gameData.science.questionStats?.[item.id] || { consecutiveCorrect: 0 };
      } else {
        stats = gameData.history.questionStats?.[item.id] || { consecutiveCorrect: 0 };
      }
      const consecutive = stats.consecutiveCorrect || 0;
      if (consecutive >= 5) {
        earned = Math.max(0.25, earned * 0.25);
      } else if (consecutive >= 3) {
        earned = Math.max(0.5, earned * 0.5);
      }

      // HINT PENALTY: Reduce coins by 50% if hint was used
      if (hintUsed) {
        earned = Math.max(0.5, earned * 0.5);
      }

      // CONFIDENCE BONUS: Fast correct answers earn more
      // Under 5 seconds = +50% bonus, 5-10 seconds = +25% bonus
      if (responseTime > 0 && responseTime < 5) {
        earned = earned * 1.5; // 50% bonus for fast answer
      } else if (responseTime >= 5 && responseTime <= 10) {
        earned = earned * 1.25; // 25% bonus for quick answer
      }

      // CHALLENGE MODE BONUS: +2 coins for correct AI-marked answers
      earned += bonusCoins;

      setHotStreak(newStreak);
    } else {
      setHotStreak(0); // Reset streak on wrong answer
    }

    const newResult = { word: displayText, wordId: item.id, attempt: input, correct, coins: earned, category: categoryField, challengeMode: challengeMode, responseTime: responseTime };
    console.log('📝 Saving result:', newResult);
    setResults(prev => {
      const updated = [...prev, newResult];
      console.log('✅ Results now:', updated.length, 'items');
      return updated;
    });
    setShowResult({ correct, word: displayText, attempt: input.trim(), streak: newStreak, aiResponse: aiResponse, challengeMode: challengeMode });
    if (earned > 0) {
      setCoinAnim(earned);
      setTimeout(() => setCoinAnim(null), 1600);
    }
  };

  const finishTest = () => {
    try {
      console.log('🏁 Finishing test. Results array has:', results.length, 'items');
      console.log('📊 Full results:', results);
      const allResults = [...results];
    const correctCount = allResults.filter(r => r.correct).length;
    const pct = (correctCount / testWords.length) * 100;
    // Completion bonus (reduced for year-long economy)
    let bonus = 2;
    if (pct === 100) bonus = 20;
    else if (pct >= 80) bonus = 10;
    else if (pct >= 60) bonus = 5;

    const questionCoins = allResults.reduce((a, r) => a + r.coins, 0);
    const totalEarned = questionCoins + bonus;

    console.log('💰 COIN CALCULATION:', {
      subject: currentSubject,
      questionsEarned: questionCoins,
      completionBonus: bonus,
      totalEarned: totalEarned,
      breakdown: allResults.map(r => ({ word: r.word, correct: r.correct, coins: r.coins }))
    });

    const today = new Date().toDateString();
    const last = gameData.lastTestDate;

    let newStreak = 1;
    if (last) {
      const lastDate = new Date(last);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastDate.toDateString() === today) newStreak = gameData.streak;
      else if (lastDate.toDateString() === yesterday.toDateString()) newStreak = gameData.streak + 1;
    }

    // Update stats (wordStats for spelling, questionStats for maths/science/history)
    const subjectData = gameData[currentSubject];
    const statsField = currentSubject === 'spelling' ? 'wordStats' : 'questionStats';
    const newStats = { ...subjectData[statsField] };

    allResults.forEach(r => {
      const prev = newStats[r.wordId] || { attempts: 0, correct: 0, consecutiveCorrect: 0 };
      newStats[r.wordId] = {
        attempts: prev.attempts + 1,
        correct: prev.correct + (r.correct ? 1 : 0),
        consecutiveCorrect: r.correct ? (prev.consecutiveCorrect || 0) + 1 : 0, // Track streak for mastery
        lastAttempt: today
      };
    });

    const previousCoins = subjectData.coins;
    const newCoins = previousCoins + totalEarned;

    console.log('🏦 UPDATING COIN BALANCE:', {
      subject: currentSubject,
      previousBalance: previousCoins,
      coinsAdded: totalEarned,
      newBalance: newCoins,
      previousTotal: subjectData.totalCoinsEarned,
      newTotal: subjectData.totalCoinsEarned + totalEarned
    });

    const newData = {
      ...gameData,
      streak: newStreak,
      bestStreak: Math.max(gameData.bestStreak, newStreak),
      lastTestDate: today,
      [currentSubject]: {
        ...subjectData,
        coins: newCoins,
        totalCoinsEarned: subjectData.totalCoinsEarned + totalEarned,
        testHistory: [...subjectData.testHistory, { date: today, score: correctCount, total: testWords.length, words: allResults.map(r => ({ word: r.word, wordId: r.wordId, correct: r.correct, category: r.category })) }],
        [statsField]: newStats
      }
    };

      newData.earnedBadges = checkBadges(newData);
      setGameData(newData);
      console.log('✅ Test complete! Navigating to results screen');
      setScreen('results');
    } catch (error) {
      console.error('❌ ERROR in finishTest:', error);
      alert(`Error saving test results: ${error.message}\n\nPlease try again or contact support.`);
    }
  };

  const nextWord = () => {
    console.log('➡️ nextWord called. currentIndex:', currentIndex, 'testWords.length:', testWords.length);
    if (currentIndex < testWords.length - 1) {
      console.log('Moving to next question');
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setInput('');
      setShowResult(null);
      setHintUsed(false); // Reset hint for next question
      setHintText(''); // Clear hint text
      setChallengeMode(false); // Reset challenge mode
      setAiResponse(null); // Reset AI response
      setQuestionStartTime(Date.now()); // Reset timer for next question

      // Set up spelling MCQ for next question
      if (currentSubject === 'spelling') {
        const useMCQ = spellingMode === 'multiple-choice' ? true :
                       spellingMode === 'type-in' ? false :
                       Math.random() < 0.5;
        setSpellingMCQ(useMCQ);
        if (useMCQ && testWords[nextIdx]) {
          const incorrects = generateIncorrectOptions(testWords[nextIdx].word, testWords[nextIdx].category);
          setSpellingOptions(shuffleArray([testWords[nextIdx].word, ...incorrects]));
        }
      }
    } else {
      console.log('Last question - calling finishTest()');
      finishTest();
    }
  };

  // Handle MCQ option selection for spelling
  const handleSpellingMCQ = (selectedOption) => {
    if (showResult !== null) return;
    setInput(selectedOption); // Set input to selected option
    // Immediately submit
    setTimeout(() => {
      const item = testWords[currentIndex];
      const correct = selectedOption.toLowerCase() === item.word.toLowerCase();

      // Calculate response time
      const responseTime = questionStartTime ? Math.round((Date.now() - questionStartTime) / 1000) : 0;

      // Calculate coins (same logic as handleSubmit)
      const newStreak = correct ? hotStreak + 1 : 0;
      setHotStreak(newStreak);

      let earned = 0;
      if (correct) {
        if (newStreak === 1) earned = 1;
        else if (newStreak === 2) earned = 2;
        else earned = 3;

        // Mastery reduction
        const stats = gameData.spelling.wordStats[item.id] || { consecutiveCorrect: 0 };
        if (stats.consecutiveCorrect >= 5) earned = Math.max(0.5, earned * 0.25);
        else if (stats.consecutiveCorrect >= 3) earned = Math.max(0.5, earned * 0.5);

        // Hint penalty
        if (hintUsed) earned = Math.max(0.5, earned * 0.5);

        // Confidence bonus
        if (responseTime > 0 && responseTime < 5) earned = earned * 1.5;
        else if (responseTime >= 5 && responseTime <= 10) earned = earned * 1.25;

        earned = Math.round(earned * 10) / 10;
        setGameData(prev => ({ ...prev, coins: prev.coins + earned }));
      }

      // Update stats
      setGameData(prev => {
        const wordStats = { ...prev.spelling.wordStats };
        const currentStats = wordStats[item.id] || { attempts: 0, correct: 0, consecutiveCorrect: 0 };
        wordStats[item.id] = {
          attempts: currentStats.attempts + 1,
          correct: currentStats.correct + (correct ? 1 : 0),
          consecutiveCorrect: correct ? currentStats.consecutiveCorrect + 1 : 0
        };
        return { ...prev, spelling: { ...prev.spelling, wordStats } };
      });

      const newResult = {
        word: item.word,
        wordId: item.id,
        attempt: selectedOption,
        correct,
        coins: earned,
        category: item.category,
        mode: 'multiple-choice',
        responseTime
      };
      setResults(prev => [...prev, newResult]);
      setShowResult(correct);
    }, 50);
  };

  const showHint = () => {
    const item = testWords[currentIndex];
    setHintUsed(true);

    let hint = '';

    if (currentSubject === 'maths') {
      // For maths, show a helpful hint based on the answer
      const answer = item.answer;

      if (item.topic === 'times-tables') {
        hint = `The answer is between ${Math.floor(parseFloat(answer) / 10) * 10} and ${Math.ceil(parseFloat(answer) / 10) * 10}`;
      } else if (item.topic === 'fractions') {
        hint = `Try converting to a common denominator!`;
      } else if (answer.includes('/')) {
        hint = `The answer is a fraction (use the / key)`;
      } else {
        const partial = answer.substring(0, Math.ceil(answer.length / 2));
        hint = `The answer starts with ${partial}...`;
      }
    } else if (currentSubject === 'spelling') {
      // For spelling, show first few letters
      const partial = item.word.substring(0, Math.ceil(item.word.length / 2));
      hint = `The word starts with "${partial}..."`;
    } else if (currentSubject === 'science') {
      // For science, give a clue about the answer
      if (item.type === 'mcq' && item.options) {
        hint = `Look carefully at all the options!`;
      } else if (item.type === 'true-false') {
        hint = `Think about what you learned in class...`;
      } else {
        hint = `Think about the key science words!`;
      }
    }

    setHintText(hint);
  };

  const claimReward = (reward) => {
    const canAfford = canAffordReward(reward, gameData);
    const tierUnlocked = isRewardUnlocked(reward, gameData);

    if (canAfford && tierUnlocked && !claimedRewards.includes(reward.id)) {
      // Calculate proportional deduction from each subject based on what they have
      const spellingCoins = gameData.spelling?.coins || 0;
      const mathsCoins = gameData.maths?.coins || 0;
      const scienceCoins = gameData.science?.coins || 0;
      const historyCoins = gameData.history?.coins || 0;
      const totalCoins = spellingCoins + mathsCoins + scienceCoins + historyCoins;

      // Deduct proportionally based on current balance
      const spellingDeduct = Math.round((spellingCoins / totalCoins) * reward.cost);
      const mathsDeduct = Math.round((mathsCoins / totalCoins) * reward.cost);
      const scienceDeduct = Math.round((scienceCoins / totalCoins) * reward.cost);
      // History gets the remainder to ensure exact total
      const historyDeduct = reward.cost - spellingDeduct - mathsDeduct - scienceDeduct;

      console.log('🎁 REWARD CLAIMED:', {
        reward: reward.name,
        totalCost: reward.cost,
        deductions: { spelling: spellingDeduct, maths: mathsDeduct, science: scienceDeduct, history: historyDeduct },
        previousBalances: { spelling: spellingCoins, maths: mathsCoins, science: scienceCoins, history: historyCoins }
      });

      setGameData(prev => ({
        ...prev,
        spelling: {
          ...prev.spelling,
          coins: Math.max(0, (prev.spelling?.coins || 0) - spellingDeduct)
        },
        maths: {
          ...prev.maths,
          coins: Math.max(0, (prev.maths?.coins || 0) - mathsDeduct)
        },
        science: {
          ...prev.science,
          coins: Math.max(0, (prev.science?.coins || 0) - scienceDeduct)
        },
        history: {
          ...prev.history,
          coins: Math.max(0, (prev.history?.coins || 0) - historyDeduct)
        },
        claimedRewards: [...prev.claimedRewards, reward.id]
      }));
    } else {
      console.log('❌ REWARD CLAIM FAILED:', {
        reward: reward.name,
        cost: reward.cost,
        tierUnlocked: tierUnlocked,
        alreadyClaimed: claimedRewards.includes(reward.id),
        reason: claimedRewards.includes(reward.id) ? 'Already claimed' :
                !tierUnlocked ? 'Tier not unlocked' : 'Not enough coins'
      });
    }
  };

  // Calculate stats
  const getStats = () => {
    if (testHistory.length === 0) return { testsDone: 0, avgScore: 0, weeklyCoins: 0 };
    const totalCorrect = testHistory.reduce((a, t) => a + t.score, 0);
    const totalQ = testHistory.reduce((a, t) => a + t.total, 0);
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const recentTests = testHistory.filter(t => new Date(t.date) >= weekAgo);
    const weeklyCoins = recentTests.reduce((a, t) => {
      const wc = t.words.filter(w => w.correct).length * 2;
      const pct = (t.score / t.total) * 100;
      return a + wc + (pct === 100 ? 50 : pct >= 80 ? 25 : pct >= 60 ? 10 : 5);
    }, 0);
    return { testsDone: testHistory.length, avgScore: Math.round((totalCorrect / totalQ) * 100), weeklyCoins };
  };

  // Category analysis
  const getCategoryStats = () => {
    const catData = {};
    testHistory.forEach(test => {
      test.words?.forEach(w => {
        if (!catData[w.category]) catData[w.category] = { correct: 0, total: 0 };
        catData[w.category].total++;
        if (w.correct) catData[w.category].correct++;
      });
    });
    return Object.entries(catData).map(([cat, data]) => ({
      category: cat,
      name: categoryNames[cat] || cat,
      pct: Math.round((data.correct / data.total) * 100),
      total: data.total
    })).sort((a, b) => a.pct - b.pct);
  };

  // Get recommendation
  const getRecommendation = () => {
    const cats = getCategoryStats();
    if (cats.length === 0) return { text: "Start your first test to see recommendations!", type: 'info' };
    const weakest = cats[0];
    if (weakest.pct < 50) return { text: `Focus on ${weakest.name} - only ${weakest.pct}% correct`, type: 'warning' };
    if (weakest.pct < 70) return { text: `${weakest.name} needs more practice (${weakest.pct}%)`, type: 'tip' };
    return { text: "Great work! Keep practicing to stay sharp!", type: 'success' };
  };

  const stats = getStats();
  const categoryStats = getCategoryStats();
  const recommendation = getRecommendation();
  const currentWord = testWords[currentIndex];

  // ============ SCREENS ============

  // Subject Selection Screen
  if (screen === 'subject-select') {
    const getSubjectStats = (subject) => {
      const data = gameData[subject];
      if (!data || !data.testHistory || data.testHistory.length === 0) {
        return { lastScore: null, mastery: 0, totalTests: 0 };
      }

      const testHistory = data.testHistory;
      const lastTest = testHistory[testHistory.length - 1];
      const lastScore = lastTest ? Math.round((lastTest.score / lastTest.total) * 100) : null;

      // Calculate mastery percentage
      const stats = subject === 'spelling' ? data.wordStats : data.questionStats;
      const attempted = Object.keys(stats).length;
      const totalItems = subject === 'spelling' ? allWords.length :
                         subject === 'maths' ? mathsQuestions.length :
                         subject === 'science' ? scienceQuestions.length : historyQuestions.length;
      const mastery = totalItems > 0 ? Math.round((attempted / totalItems) * 100) : 0;

      return { lastScore, mastery, totalTests: testHistory.length };
    };

    const spellingStats = getSubjectStats('spelling');
    const mathsStats = getSubjectStats('maths');
    const scienceStats = getSubjectStats('science');
    const historyStats = getSubjectStats('history');

    const selectSubject = (subject) => {
      setGameData(prev => ({ ...prev, currentSubject: subject }));
      setScreen('home');
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-600 via-pink-500 to-orange-500 p-4">
        {newBadge && <BadgePopup badge={newBadge} onClose={() => setNewBadge(null)} />}
        <div className="max-w-md mx-auto">
          {/* Header with streak */}
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="text-lg font-bold text-white">{streak} day streak</span>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">
              <span className="text-white/80 text-sm font-semibold">Total: {(spelling?.coins || 0) + (maths?.coins || 0) + (science?.coins || 0) + (history?.coins || 0)} 🪙</span>
            </div>
          </div>

          {/* Coins grid - 2x2 layout */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="bg-white/15 backdrop-blur rounded-xl p-3 flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <div>
                <div className="text-white font-bold">{spelling.coins} 🪙</div>
                <div className="text-white/60 text-xs">Spelling</div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-3 flex items-center gap-2">
              <span className="text-2xl">🔢</span>
              <div>
                <div className="text-white font-bold">{maths.coins} 🪙</div>
                <div className="text-white/60 text-xs">Maths</div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-3 flex items-center gap-2">
              <span className="text-2xl">🔬</span>
              <div>
                <div className="text-white font-bold">{science.coins} 🪙</div>
                <div className="text-white/60 text-xs">Science</div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-3 flex items-center gap-2">
              <span className="text-2xl">📜</span>
              <div>
                <div className="text-white font-bold">{history?.coins || 0} 🪙</div>
                <div className="text-white/60 text-xs">History</div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white text-center mb-2">Alba's Learning</h1>
          <p className="text-white/90 text-center mb-8 text-lg">Choose your subject! 🎓</p>

          {/* Subject Cards */}
          <div className="space-y-4">
            {/* Spelling */}
            <button
              onClick={() => selectSubject('spelling')}
              className="w-full bg-white rounded-3xl p-6 shadow-xl active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="text-5xl">📚</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-2xl text-purple-600">English</div>
                  <div className="text-gray-500 text-sm">{allWords.length} spellings + Reading & Grammar</div>
                </div>
              </div>
              {spellingStats.totalTests > 0 && (
                <div className="flex gap-4 text-sm">
                  <div className="flex-1 bg-purple-50 rounded-lg p-2">
                    <div className="text-purple-600 font-semibold">Last Score</div>
                    <div className="text-2xl font-bold text-purple-700">{spellingStats.lastScore}%</div>
                  </div>
                  <div className="flex-1 bg-purple-50 rounded-lg p-2">
                    <div className="text-purple-600 font-semibold">Mastery</div>
                    <div className="text-2xl font-bold text-purple-700">{spellingStats.mastery}%</div>
                  </div>
                  <div className="flex-1 bg-purple-50 rounded-lg p-2">
                    <div className="text-purple-600 font-semibold">Tests</div>
                    <div className="text-2xl font-bold text-purple-700">{spellingStats.totalTests}</div>
                  </div>
                </div>
              )}
            </button>

            {/* Maths */}
            <button
              onClick={() => selectSubject('maths')}
              className="w-full bg-white rounded-3xl p-6 shadow-xl active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="text-5xl">🔢</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-2xl text-blue-600">Maths</div>
                  <div className="text-gray-500 text-sm">105 questions across 8 topics</div>
                </div>
              </div>
              {mathsStats.totalTests > 0 ? (
                <div className="flex gap-4 text-sm">
                  <div className="flex-1 bg-blue-50 rounded-lg p-2">
                    <div className="text-blue-600 font-semibold">Last Score</div>
                    <div className="text-2xl font-bold text-blue-700">{mathsStats.lastScore}%</div>
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-lg p-2">
                    <div className="text-blue-600 font-semibold">Mastery</div>
                    <div className="text-2xl font-bold text-blue-700">{mathsStats.mastery}%</div>
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-lg p-2">
                    <div className="text-blue-600 font-semibold">Tests</div>
                    <div className="text-2xl font-bold text-blue-700">{mathsStats.totalTests}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <span className="text-blue-600 font-semibold">✨ New! Start your first test</span>
                </div>
              )}
            </button>

            {/* Science */}
            <button
              onClick={() => selectSubject('science')}
              className="w-full bg-white rounded-3xl p-6 shadow-xl active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="text-5xl">🔬</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-2xl text-emerald-600">Science</div>
                  <div className="text-gray-500 text-sm">{scienceQuestions.length} questions across 10 topics</div>
                </div>
              </div>
              {scienceStats.totalTests > 0 ? (
                <div className="flex gap-4 text-sm">
                  <div className="flex-1 bg-emerald-50 rounded-lg p-2">
                    <div className="text-emerald-600 font-semibold">Last Score</div>
                    <div className="text-2xl font-bold text-emerald-700">{scienceStats.lastScore}%</div>
                  </div>
                  <div className="flex-1 bg-emerald-50 rounded-lg p-2">
                    <div className="text-emerald-600 font-semibold">Mastery</div>
                    <div className="text-2xl font-bold text-emerald-700">{scienceStats.mastery}%</div>
                  </div>
                  <div className="flex-1 bg-emerald-50 rounded-lg p-2">
                    <div className="text-emerald-600 font-semibold">Tests</div>
                    <div className="text-2xl font-bold text-emerald-700">{scienceStats.totalTests}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <span className="text-emerald-600 font-semibold">✨ New! Start your first test</span>
                </div>
              )}
            </button>

            {/* History */}
            <button
              onClick={() => selectSubject('history')}
              className="w-full bg-white rounded-3xl p-6 shadow-xl active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="text-5xl">📜</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-2xl text-amber-600">History</div>
                  <div className="text-gray-500 text-sm">{historyQuestions.length} questions across 9 topics</div>
                </div>
              </div>
              {historyStats.totalTests > 0 ? (
                <div className="flex gap-4 text-sm">
                  <div className="flex-1 bg-amber-50 rounded-lg p-2">
                    <div className="text-amber-600 font-semibold">Last Score</div>
                    <div className="text-2xl font-bold text-amber-700">{historyStats.lastScore}%</div>
                  </div>
                  <div className="flex-1 bg-amber-50 rounded-lg p-2">
                    <div className="text-amber-600 font-semibold">Mastery</div>
                    <div className="text-2xl font-bold text-amber-700">{historyStats.mastery}%</div>
                  </div>
                  <div className="flex-1 bg-amber-50 rounded-lg p-2">
                    <div className="text-amber-600 font-semibold">Tests</div>
                    <div className="text-2xl font-bold text-amber-700">{historyStats.totalTests}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <span className="text-amber-600 font-semibold">✨ New! Start your first test</span>
                </div>
              )}
            </button>
          </div>

          {/* Quick Access Buttons - Rewards & Badges */}
          <div className="grid grid-cols-2 gap-3 mt-6 mb-4">
            <button
              onClick={() => setScreen('rewards')}
              className="bg-white rounded-2xl p-4 shadow-lg active:scale-95 transition-transform"
            >
              <div className="text-3xl mb-2">🎁</div>
              <div className="font-bold text-gray-800 text-sm">Rewards Shop</div>
              {(() => {
                const canAfford = sampleRewards.filter(r =>
                  !claimedRewards.includes(r.id) &&
                  isRewardUnlocked(r, gameData) &&
                  canAffordReward(r, gameData)
                ).length;
                return canAfford > 0 && (
                  <div className="mt-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block">
                    {canAfford} available
                  </div>
                );
              })()}
            </button>

            <button
              onClick={() => setScreen('badges')}
              className="bg-white rounded-2xl p-4 shadow-lg active:scale-95 transition-transform"
            >
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-bold text-gray-800 text-sm">Badge Gallery</div>
              <div className="mt-2 text-gray-600 text-xs">
                {earnedBadges.length}/{badges.length} earned
              </div>
            </button>
          </div>

          {/* SATs Prep button */}
          <button onClick={() => setScreen('sats-select')} className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 shadow-xl active:scale-98 transition-transform">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">🎓</span>
              <div className="text-left">
                <div className="font-bold text-white text-lg">SATs Preparation</div>
                <div className="text-white/80 text-xs">May 2026 exam prep</div>
              </div>
            </div>
          </button>

          {/* Assessment & Recommendations button */}
          <button onClick={() => setScreen('assessment-hub')} className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-5 shadow-xl active:scale-98 transition-transform">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">🎯</span>
              <div className="text-left">
                <div className="font-bold text-white text-lg">Assessment & Plan</div>
                <div className="text-white/80 text-xs">Find your strengths & focus areas</div>
              </div>
            </div>
          </button>

          {/* Settings button */}
          <button onClick={() => setScreen('settings')} className="w-full mt-4 bg-white/10 rounded-2xl p-4 shadow active:scale-98 flex items-center justify-center gap-2">
            <span className="text-2xl">⚙️</span>
            <span className="text-white text-sm">Settings</span>
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'assessment-hub') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-600 via-rose-600 to-orange-500 p-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => setScreen('subject-select')} className="text-white/80 mb-6">← Back</button>

          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🎯</div>
            <h1 class="text-3xl font-bold text-white mb-2">Assessment & Plan</h1>
            <p className="text-white/90">Find your strengths and get personalized recommendations</p>
          </div>

          {/* Assessment Subject Cards */}
          <div className="space-y-4">
            <button
              onClick={() => setScreen('assessment-english')}
              className="w-full bg-white rounded-3xl p-6 shadow-xl active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">📚</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-2xl text-purple-600">English Assessment</div>
                  <div className="text-gray-500 text-sm">20 questions • 10-15 mins</div>
                  {gameData.spelling?.assessmentTaken && (
                    <div className="text-xs text-green-600 mt-1">✓ Completed</div>
                  )}
                </div>
              </div>
            </button>

            <button
              onClick={() => setScreen('assessment-maths')}
              className="w-full bg-white rounded-3xl p-6 shadow-xl active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">🔢</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-2xl text-blue-600">Maths Assessment</div>
                  <div className="text-gray-500 text-sm">15 questions • 10 mins</div>
                  {gameData.maths?.assessmentTaken && (
                    <div className="text-xs text-green-600 mt-1">✓ Completed</div>
                  )}
                </div>
              </div>
            </button>

            <button
              onClick={() => setScreen('assessment-science')}
              className="w-full bg-white rounded-3xl p-6 shadow-xl active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">🔬</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-2xl text-emerald-600">Science Assessment</div>
                  <div className="text-gray-500 text-sm">15 questions • 10 mins</div>
                  {gameData.science?.assessmentTaken && (
                    <div className="text-xs text-green-600 mt-1">✓ Completed</div>
                  )}
                </div>
              </div>
            </button>

            <button
              onClick={() => setScreen('assessment-history')}
              className="w-full bg-white rounded-3xl p-6 shadow-xl active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">📜</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-2xl text-amber-600">History Assessment</div>
                  <div className="text-gray-500 text-sm">10 questions • 8 mins</div>
                  {gameData.history?.assessmentTaken && (
                    <div className="text-xs text-green-600 mt-1">✓ Completed</div>
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-white/20 backdrop-blur rounded-2xl p-4">
            <div class="text-white/90 text-sm text-center">
              <p className="font-semibold mb-1">🎯 How it works</p>
              <p className="text-xs text-white/70">Quick test finds your strengths, then we create your perfect practice plan!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Assessment screens (placeholders for now)
  if (screen === 'assessment-english' || screen === 'assessment-maths' || screen === 'assessment-science' || screen === 'assessment-history') {
    const subjectName = screen.replace('assessment-', '');
    const subjectInfo = {
      english: { emoji: '📚', name: 'English', questions: 20, color: 'purple' },
      maths: { emoji: '🔢', name: 'Maths', questions: 15, color: 'blue' },
      science: { emoji: '🔬', name: 'Science', questions: 15, color: 'emerald' },
      history: { emoji: '📜', name: 'History', questions: 10, color: 'amber' }
    }[subjectName];

    return (
      <div className={`min-h-screen bg-gradient-to-b from-${subjectInfo.color}-500 to-${subjectInfo.color}-600 p-4`}>
        <div className="max-w-md mx-auto">
          <button onClick={() => setScreen('assessment-hub')} className="text-white/80 mb-6">← Back</button>

          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{subjectInfo.emoji}</div>
            <h1 className="text-3xl font-bold text-white mb-2">{subjectInfo.name} Assessment</h1>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon!</h2>
            <p className="text-gray-600 mb-4">{subjectInfo.questions}-question assessment to gauge your level</p>
            <p className="text-sm text-gray-500">Features planned: Personalized learning plan, topic recommendations, progress tracking</p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'sats-select') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-500 p-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => setScreen('subject-select')} className="text-white/80 mb-6">← Back</button>

          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🎓</div>
            <h1 className="text-3xl font-bold text-white mb-2">SATs Preparation</h1>
            <p className="text-white/90">May 2026 Exam Prep</p>
          </div>

          {/* SATs Subject Cards */}
          <div className="space-y-4">
            {/* Reading */}
            <button
              onClick={() => setScreen('sats-reading')}
              className="w-full bg-white rounded-3xl p-6 shadow-xl active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">📖</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-2xl text-indigo-600">Reading</div>
                  <div className="text-gray-500 text-sm">Comprehension & inference</div>
                  <div className="text-xs text-gray-400 mt-1">60 min test • 50 marks</div>
                </div>
              </div>
            </button>

            {/* GPS (Grammar, Punctuation, Spelling) */}
            <button
              onClick={() => setScreen('sats-gps')}
              className="w-full bg-white rounded-3xl p-6 shadow-xl active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">✍️</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-2xl text-purple-600">GPS</div>
                  <div className="text-gray-500 text-sm">Grammar, Punctuation & Spelling</div>
                  <div className="text-xs text-gray-400 mt-1">2 papers • 70 marks total</div>
                </div>
              </div>
            </button>

            {/* Maths */}
            <button
              onClick={() => setScreen('sats-maths')}
              className="w-full bg-white rounded-3xl p-6 shadow-xl active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">🔢</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-2xl text-blue-600">Maths</div>
                  <div className="text-gray-500 text-sm">Arithmetic & Reasoning</div>
                  <div className="text-xs text-gray-400 mt-1">3 papers • 110 marks total</div>
                </div>
              </div>
            </button>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-white/20 backdrop-blur rounded-2xl p-4">
            <div className="text-white/90 text-sm text-center">
              <p className="font-semibold mb-1">🗓️ SATs: May 2026</p>
              <p className="text-xs text-white/70">Practice with real past papers (2016-2025)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'sats-reading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-500 to-blue-600 p-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => setScreen('sats-select')} className="text-white/80 mb-6">← Back to SATs</button>

          <div className="text-center mb-6">
            <div className="text-6xl mb-3">📖</div>
            <h1 className="text-3xl font-bold text-white mb-2">Reading Practice</h1>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon!</h2>
            <p className="text-gray-600 mb-4">Reading comprehension practice with past papers</p>
            <p className="text-sm text-gray-500">Features planned: Passages, MCQ, short answers, AI marking</p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'sats-gps') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-500 to-pink-600 p-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => setScreen('sats-select')} className="text-white/80 mb-6">← Back to SATs</button>

          <div className="text-center mb-6">
            <div className="text-6xl mb-3">✍️</div>
            <h1 className="text-3xl font-bold text-white mb-2">GPS Practice</h1>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon!</h2>
            <p className="text-gray-600 mb-4">Grammar, Punctuation & Spelling practice</p>
            <p className="text-sm text-gray-500">Features planned: Sentence correction, word types, punctuation placement</p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'sats-maths') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-cyan-600 p-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => setScreen('sats-select')} className="text-white/80 mb-6">← Back to SATs</button>

          <div className="text-center mb-6">
            <div className="text-6xl mb-3">🔢</div>
            <h1 className="text-3xl font-bold text-white mb-2">SATs Maths</h1>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon!</h2>
            <p className="text-gray-600 mb-4">Arithmetic & Reasoning practice</p>
            <p className="text-sm text-gray-500">Features planned: Timed tests, calculator toggle, past paper questions</p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'topic-select') {
    const bgGradient = currentSubject === 'spelling' ? 'from-purple-500 to-indigo-600' :
                       currentSubject === 'maths' ? 'from-blue-500 to-cyan-600' :
                       currentSubject === 'science' ? 'from-emerald-500 to-teal-600' :
                       'from-amber-500 to-orange-600';
    const subjectName = currentSubject === 'spelling' ? 'English' : currentSubject === 'maths' ? 'Maths' : currentSubject === 'science' ? 'Science' : 'History';
    const topicNames = currentSubject === 'spelling' ? englishTopicNames :
                       currentSubject === 'maths' ? mathsTopicNames :
                       currentSubject === 'science' ? scienceTopicNames :
                       historyTopicNames;

    // Get smart recommendation
    const todaysPick = getTodaysPick(currentSubject, gameData);

    // Categorize topics by status
    const topicsWithStats = Object.entries(topicNames).map(([key, name]) => ({
      key,
      name,
      stats: getTopicStats(currentSubject, key, gameData)
    }));

    const needsFocus = topicsWithStats.filter(t => t.stats.attempts >= 2 && t.stats.accuracy < 50);
    const newTopics = topicsWithStats.filter(t => t.stats.attempts === 0);
    const practice = topicsWithStats.filter(t => t.stats.accuracy >= 50 && t.stats.accuracy < 75);
    const doingWell = topicsWithStats.filter(t => t.stats.accuracy >= 75);

    return (
      <div className={`min-h-screen bg-gradient-to-b ${bgGradient} p-4`}>
        <div className="max-w-md mx-auto">
          <button onClick={() => setScreen('home')} className="text-white/80 mb-4">← Back</button>

          <h2 className="text-2xl font-bold text-white text-center mb-6">Choose Your {subjectName} Topic</h2>

          {/* Quick Start - All Topics */}
          <button
            onClick={() => {
              if (currentSubject === 'maths') setSelectedMathsTopic('all');
              if (currentSubject === 'science') setSelectedScienceTopic('all');
              if (currentSubject === 'history') setSelectedHistoryTopic('all');
              startTest();
            }}
            className="w-full bg-white p-4 rounded-2xl shadow-lg mb-4 ring-2 ring-white"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎲</span>
              <div className="text-left">
                <div className="font-bold text-lg text-gray-800">All Topics Mix</div>
                <div className="text-xs text-gray-600">Quick start • Mixed practice</div>
              </div>
            </div>
          </button>

          {/* Smart Sections */}
          <div className="space-y-4">

            {/* NEEDS FOCUS Section */}
            {needsFocus.length > 0 && (
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                <div className="text-white text-sm font-bold mb-2 flex items-center gap-2">
                  <span>🔴</span>
                  <span>NEEDS FOCUS ({needsFocus.length})</span>
                </div>
                <div className="space-y-2">
                  {needsFocus.map((topic) => {
                    const isRecommended = todaysPick && todaysPick.topic.key === topic.key;
                    return (
                      <button
                        key={topic.key}
                        onClick={() => {
                          if (currentSubject === 'maths') setSelectedMathsTopic(topic.key);
                          if (currentSubject === 'science') setSelectedScienceTopic(topic.key);
                          if (currentSubject === 'history') setSelectedHistoryTopic(topic.key);
                          startTest();
                        }}
                        className="w-full bg-red-50 border-2 border-red-300 p-3 rounded-xl text-left hover:bg-red-100 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-bold text-gray-800 flex items-center gap-2">
                              {topic.name}
                              {isRecommended && (
                                <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">⭐ Try This</span>
                              )}
                            </div>
                            {topic.stats.lastDate && (
                              <div className="text-xs text-gray-600">Last: {daysSince(topic.stats.lastDate)} days ago</div>
                            )}
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-sm font-bold text-red-600">{topic.stats.accuracy}%</div>
                            <div className="flex gap-0.5 mt-1">
                              {[...Array(4)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < Math.ceil(topic.stats.accuracy / 25) ? 'bg-red-500' : 'bg-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NEW TOPICS Section */}
            {newTopics.length > 0 && (
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                <div className="text-white text-sm font-bold mb-2 flex items-center gap-2">
                  <span>🔵</span>
                  <span>NEW TOPICS ({newTopics.length})</span>
                </div>
                <div className="space-y-2">
                  {newTopics.map((topic) => {
                    const isRecommended = todaysPick && todaysPick.topic.key === topic.key;
                    return (
                      <button
                        key={topic.key}
                        onClick={() => {
                          if (currentSubject === 'maths') setSelectedMathsTopic(topic.key);
                          if (currentSubject === 'science') setSelectedScienceTopic(topic.key);
                          if (currentSubject === 'history') setSelectedHistoryTopic(topic.key);
                          startTest();
                        }}
                        className="w-full bg-blue-50 border border-blue-200 p-3 rounded-xl text-left hover:bg-blue-100 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-gray-800">{topic.name}</div>
                          <div className="flex items-center gap-2">
                            {isRecommended && (
                              <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">⭐ Try</span>
                            )}
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">New!</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PRACTICE Section */}
            {practice.length > 0 && (
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                <div className="text-white text-sm font-bold mb-2 flex items-center gap-2">
                  <span>🟡</span>
                  <span>PRACTICE ({practice.length})</span>
                </div>
                <div className="space-y-2">
                  {practice.map((topic) => (
                    <button
                      key={topic.key}
                      onClick={() => {
                        if (currentSubject === 'maths') setSelectedMathsTopic(topic.key);
                        if (currentSubject === 'science') setSelectedScienceTopic(topic.key);
                        if (currentSubject === 'history') setSelectedHistoryTopic(topic.key);
                        startTest();
                      }}
                      className="w-full bg-white/90 p-3 rounded-xl text-left hover:bg-white transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-800">{topic.name}</div>
                        <div className="text-sm text-gray-600">{topic.stats.accuracy}%</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DOING WELL Section (Collapsed) */}
            {doingWell.length > 0 && (
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                <div className="text-white text-sm font-bold">
                  <span>🟢 DOING WELL ({doingWell.length})</span>
                  <div className="text-white/60 text-xs mt-1">Topics you've mastered (&gt;75%)</div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  if (screen === 'home') {
    const subjectName = currentSubject === 'spelling' ? 'English' : currentSubject === 'maths' ? 'Maths' : currentSubject === 'science' ? 'Science' : 'History';
    const subjectIcon = currentSubject === 'spelling' ? '📚' : currentSubject === 'maths' ? '🔢' : currentSubject === 'science' ? '🔬' : '📜';
    const itemType = currentSubject === 'spelling' ? 'words' : 'questions';
    const bgGradient = currentSubject === 'spelling' ? 'from-purple-500 to-indigo-600' : currentSubject === 'maths' ? 'from-blue-500 to-cyan-600' : currentSubject === 'science' ? 'from-emerald-500 to-teal-600' : 'from-amber-500 to-orange-600';

    // Calculate mastery percentage
    const subjectData = gameData[currentSubject];
    const totalQuestions = currentSubject === 'spelling' ? allWords.length : currentSubject === 'maths' ? mathsQuestions.length : currentSubject === 'science' ? scienceQuestions.length : historyQuestions.length;
    const statsObj = currentSubject === 'spelling' ? subjectData.wordStats : subjectData.questionStats;
    const masteredCount = Object.values(statsObj || {}).filter(s => (s.consecutiveCorrect || 0) >= 3).length;
    const masteryPct = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;

    // Count available rewards
    const availableRewards = sampleRewards.filter(r =>
      isRewardUnlocked(r, gameData) &&
      !claimedRewards.includes(r.id) &&
      r.cost <= gameData[currentSubject].coins
    ).length;

    return (
      <div className={`min-h-screen bg-gradient-to-b ${bgGradient} p-4 relative overflow-hidden`}>
        {newBadge && <BadgePopup badge={newBadge} onClose={() => setNewBadge(null)} />}

        {/* Floating sparkles animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${15 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + (i % 2)}s`
              }}
            >
              {['⭐', '✨', '🌟', '💫'][i % 4]}
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto relative z-10">
          {/* Back button */}
          <button
            onClick={() => setScreen('subject-select')}
            className="text-white/80 text-sm mb-4 flex items-center gap-1 active:scale-95"
          >
            ← Back to Subjects
          </button>

          {/* Animated mascot header */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-2 animate-bounce" style={{animationDuration: '2s'}}>
              {subjectIcon}
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Alba's {subjectName}</h1>
            <p className="text-white/90 text-lg font-medium">Ready to level up? 🚀</p>
          </div>

          {/* 3 Colorful stat cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Coins - Yellow/Orange */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-3 text-center shadow-lg">
              <div className="text-2xl mb-1">🪙</div>
              <div className="text-2xl font-bold text-white">{Math.floor(gameData[currentSubject].coins)}</div>
              <div className="text-xs text-white/80 font-medium">Coins</div>
            </div>
            {/* Streak - Red/Pink */}
            <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl p-3 text-center shadow-lg">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-2xl font-bold text-white">{streak}</div>
              <div className="text-xs text-white/80 font-medium">Day Streak</div>
            </div>
            {/* Mastery - Green/Emerald */}
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-3 text-center shadow-lg">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-2xl font-bold text-white">{masteryPct}%</div>
              <div className="text-xs text-white/80 font-medium">Mastery</div>
            </div>
          </div>

          {/* Active Goals */}
          {gameData.goals && gameData.goals.filter(g => g.status === 'active').length > 0 && (
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-4">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <span>🎯</span>
                <span>Active Goals</span>
              </h3>
              {gameData.goals.filter(g => g.status === 'active').slice(0, 2).map(goal => {
                const progress = goal.type === 'streak' ? gameData.streak :
                                 goal.type === 'testCount' ? (gameData[goal.subject]?.testHistory?.length || 0) :
                                 0;
                const progressPct = Math.min(100, Math.round((progress / goal.target) * 100));

                return (
                  <div key={goal.id} className="bg-white/30 rounded-xl p-3 mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">{goal.description}</span>
                      <span className="text-white/80 text-xs">{progress}/{goal.target}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white rounded-full h-2 transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    {goal.reward && (
                      <div className="text-white/70 text-xs mt-1">🎁 {goal.reward}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Practice Recommendations - Smart suggestions based on weak areas */}
          {(() => {
            const statsObj = currentSubject === 'spelling' ? subjectData.wordStats : subjectData.questionStats;
            const weakItems = Object.entries(statsObj || {})
              .filter(([id, stat]) => stat.attempts >= 2 && (stat.correct / stat.attempts) < 0.6)
              .slice(0, 3);

            if (weakItems.length > 0) {
              return (
                <div className="bg-red-500/20 backdrop-blur border-2 border-red-300/50 rounded-2xl p-4 mb-4">
                  <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <span>💡</span>
                    <span>Focus Areas</span>
                  </h3>
                  <p className="text-white/90 text-sm mb-3">Practice these to improve faster:</p>
                  <div className="space-y-2">
                    {weakItems.map(([id, stat], idx) => {
                      const accuracy = Math.round((stat.correct / stat.attempts) * 100);
                      return (
                        <div key={idx} className="bg-white/20 rounded-lg p-2 flex items-center justify-between">
                          <span className="text-white text-sm font-semibold">
                            {currentSubject === 'spelling' ? allWords.find(w => w.id === parseInt(id))?.category : 'Topic'} ({accuracy}%)
                          </span>
                          <span className="text-white/70 text-xs">{stat.attempts} attempts</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* HUGE pulsing START TEST button */}
          <button
            onClick={() => setScreen('topic-select')}
            className="w-full bg-white rounded-3xl p-8 mb-6 shadow-2xl active:scale-95 transition-all relative overflow-hidden group"
            style={{
              boxShadow: '0 0 30px rgba(255,255,255,0.5), 0 10px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-white to-yellow-200 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-5xl mb-2 animate-pulse">🚀</span>
              <div className="text-2xl font-bold text-gray-800">START TEST</div>
              <div className="text-gray-500 text-sm mt-1">Pick your topic →</div>
            </div>
          </button>

          {/* 2x2 Quick access grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button onClick={() => setScreen('progress')} className="bg-white/90 rounded-2xl p-4 shadow-lg active:scale-95 flex flex-col items-center">
              <span className="text-3xl mb-1">📊</span>
              <span className="font-bold text-gray-800">Progress</span>
            </button>
            <button onClick={() => setScreen('rewards')} className="bg-white/90 rounded-2xl p-4 shadow-lg active:scale-95 flex flex-col items-center relative">
              <span className="text-3xl mb-1">🎁</span>
              <span className="font-bold text-gray-800">Rewards</span>
              {availableRewards > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {availableRewards}
                </span>
              )}
            </button>
            <button onClick={() => setScreen('badges')} className="bg-white/90 rounded-2xl p-4 shadow-lg active:scale-95 flex flex-col items-center">
              <span className="text-3xl mb-1">🏆</span>
              <span className="font-bold text-gray-800">Badges</span>
            </button>
            <button onClick={() => setScreen('settings')} className="bg-white/90 rounded-2xl p-4 shadow-lg active:scale-95 flex flex-col items-center">
              <span className="text-3xl mb-1">⚙️</span>
              <span className="font-bold text-gray-800">Settings</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'settings') {
    return <SettingsScreen ttsService={ttsService} onBack={() => setScreen('home')} onOpenDashboard={() => setScreen('dashboard')} spellingMode={spellingMode} setSpellingMode={setSpellingMode} />;
  }

  if (screen === 'dashboard') {
    return <ParentDashboard gameData={gameData} onBack={() => setScreen('settings')} />;
  }

  if (screen === 'test') {
    // Safety check - if no questions, go back to home
    if (!currentWord) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-red-500 to-orange-600 p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center max-w-md">
            <p className="text-6xl mb-4">⚠️</p>
            <h2 className="text-xl font-bold text-gray-800 mb-4">No questions loaded</h2>
            <button onClick={() => setScreen('home')} className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold">
              Go Home
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-cyan-600 p-4 relative">
        {coinAnim && <CoinAnimation amount={coinAnim} />}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setScreen('home')} className="text-white/80 text-sm">✕ Quit</button>
            <div className="flex items-center gap-4">
              {hotStreak >= 2 && (
                <div className="flex items-center gap-1 bg-orange-500 px-3 py-1 rounded-full">
                  <span className="text-lg">🔥</span>
                  <span className="text-sm font-bold text-white">{hotStreak}x</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <span className="text-lg font-bold text-white">{gameData[currentSubject].coins}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/20 rounded-full h-2 mb-6">
            <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${((currentIndex + 1) / testWords.length) * 100}%` }} />
          </div>
          <p className="text-white/80 text-center text-sm mb-4">{currentSubject === 'spelling' ? 'Word' : 'Question'} {currentIndex + 1} of {testWords.length}</p>

          <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
            {currentSubject === 'spelling' ? (
              <>
                <button onClick={() => speak(`${currentWord.word}. ${currentWord.sentence}. ${currentWord.word}.`)} disabled={speaking} className="w-full bg-indigo-100 rounded-xl p-4 mb-4 flex items-center justify-center gap-2 active:bg-indigo-200">
                  <span className="text-2xl">{speaking ? '🔊' : '🔈'}</span>
                  <span className="font-semibold text-indigo-700">Hear Word</span>
                </button>
                <p className="text-gray-500 text-center text-sm mb-4">"{currentWord.sentence}"</p>
              </>
            ) : currentSubject === 'maths' ? (
              <>
                <div className="text-center mb-4 p-6 bg-indigo-50 rounded-xl">
                  <p className="text-4xl font-bold text-indigo-900">{currentWord.question}</p>
                </div>
                <button onClick={() => speak(currentWord.ttsText || currentWord.question)} disabled={speaking} className="w-full bg-indigo-100 rounded-xl p-3 mb-4 flex items-center justify-center gap-2 active:bg-indigo-200">
                  <span className="text-xl">{speaking ? '🔊' : '🔈'}</span>
                  <span className="font-semibold text-indigo-700 text-sm">Hear Question</span>
                </button>

                {/* Drawing Scratchpad */}
                <DrawingCanvas />
              </>
            ) : currentSubject === 'science' ? (
              <>
                <div className="text-center mb-4 p-4 bg-emerald-50 rounded-xl">
                  <p className="text-xl font-bold text-emerald-900 leading-relaxed">{currentWord.question}</p>
                </div>
                <button onClick={() => speak(currentWord.question)} disabled={speaking} className="w-full bg-emerald-100 rounded-xl p-3 mb-4 flex items-center justify-center gap-2 active:bg-emerald-200">
                  <span className="text-xl">{speaking ? '🔊' : '🔈'}</span>
                  <span className="font-semibold text-emerald-700 text-sm">Hear Question</span>
                </button>
              </>
            ) : currentSubject === 'history' ? (
              <>
                <div className="text-center mb-4 p-4 bg-amber-50 rounded-xl">
                  <p className="text-xl font-bold text-amber-900 leading-relaxed">{currentWord.question}</p>
                </div>
                <button onClick={() => speak(currentWord.question)} disabled={speaking} className="w-full bg-amber-100 rounded-xl p-3 mb-4 flex items-center justify-center gap-2 active:bg-amber-200">
                  <span className="text-xl">{speaking ? '🔊' : '🔈'}</span>
                  <span className="font-semibold text-amber-700 text-sm">Hear Question</span>
                </button>
              </>
            ) : null}

{/* Input display - hide for Science, History, and Spelling MCQ mode */}
            {currentSubject !== 'science' && currentSubject !== 'history' && !(currentSubject === 'spelling' && spellingMCQ) && (
              <div className="bg-gray-100 rounded-xl p-4 min-h-16 flex items-center justify-center mb-2">
                <span className="text-2xl font-bold tracking-wider text-gray-800">{input || <span className="text-gray-400">{currentSubject === 'maths' ? 'Your answer...' : 'Type here...'}</span>}</span>
              </div>
            )}

            {/* Spelling MCQ mode indicator */}
            {currentSubject === 'spelling' && spellingMCQ && showResult === null && (
              <div className="bg-purple-100 rounded-xl p-3 mb-2 text-center">
                <p className="text-purple-700 font-semibold text-sm">📝 Which spelling is correct?</p>
              </div>
            )}

            {aiMarking && (
              <div className="bg-purple-100 rounded-xl p-4 mb-2 text-center">
                <p className="text-purple-700 font-bold animate-pulse">🤖 AI is marking your answer...</p>
              </div>
            )}

            {showResult !== null && (
              <div className={`rounded-xl p-4 mb-2 ${showResult.correct ? 'bg-green-100' : 'bg-red-100'}`}>
                {showResult.correct ? (
                  <div className="text-center">
                    <p className="font-bold text-green-700">
                      ✓ Correct! +{showResult.streak === 1 ? 1 : showResult.streak === 2 ? 2 : 3}{showResult.challengeMode ? '+2' : ''} 🪙
                      {showResult.streak >= 2 && <span className="block text-sm mt-1">🔥 {showResult.streak} in a row! Streak bonus!</span>}
                      {showResult.challengeMode && <span className="block text-sm mt-1 text-purple-600">🎯 Challenge Mode bonus!</span>}
                    </p>
                    {showResult.aiResponse && (
                      <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                        <p className="text-purple-700 text-sm">🤖 {showResult.aiResponse}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="font-bold text-red-700 mb-3">Let's learn together! 💪</p>

                    {currentSubject === 'spelling' ? (
                      <>
                        {/* Your spelling - bigger, clearer for dyslexia */}
                        <div className="mb-2">
                          <p className="text-xs text-gray-600 mb-1">You wrote:</p>
                          <div className="flex justify-center gap-1 mb-3">
                            {(showResult.attempt || '').split('').map((letter, i) => {
                              const correctWord = showResult.word.toLowerCase();
                              const isCorrect = i < correctWord.length && letter === correctWord[i];
                              return (
                                <span
                                  key={i}
                                  className={`text-2xl font-bold px-1 rounded ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                                  style={{ fontFamily: 'monospace' }}
                                >
                                  {letter}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Correct spelling - clear reference */}
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Correct spelling:</p>
                          <div className="flex justify-center gap-1">
                            {showResult.word.toLowerCase().split('').map((letter, i) => (
                              <span
                                key={i}
                                className="text-2xl font-bold text-green-700 px-1"
                                style={{ fontFamily: 'monospace' }}
                              >
                                {letter}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : currentSubject === 'maths' ? (
                      <>
                        <p className="text-2xl font-bold text-red-700 mb-2">Your answer: {showResult.attempt}</p>
                        <p className="text-2xl font-bold text-green-700">Correct answer: {currentWord.answer}</p>
                      </>
                    ) : currentSubject === 'science' ? (
                      <>
                        <p className="text-lg text-red-700 mb-2">Your answer: {showResult.attempt}</p>
                        {currentWord.type === 'multiple-choice' && (
                          <p className="text-lg font-bold text-green-700">Correct: {currentWord.options[currentWord.answer]}</p>
                        )}
                        {currentWord.type === 'true-false' && (
                          <p className="text-lg font-bold text-green-700">Correct answer: {currentWord.answer ? 'TRUE' : 'FALSE'}</p>
                        )}
                        {showResult.aiResponse && (
                          <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                            <p className="text-purple-700 text-sm font-medium">🤖 AI says: {showResult.aiResponse}</p>
                          </div>
                        )}
                      </>
                    ) : currentSubject === 'history' ? (
                      <>
                        <p className="text-lg text-red-700 mb-2">Your answer: {showResult.attempt}</p>
                        {currentWord.type === 'mcq' && (
                          <p className="text-lg font-bold text-green-700">Correct: {currentWord.answer}</p>
                        )}
                        {currentWord.type === 'true-false' && (
                          <p className="text-lg font-bold text-green-700">Correct answer: {currentWord.answer ? 'TRUE' : 'FALSE'}</p>
                        )}
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            )}
          </div>

          {showResult === null ? (
            <>
              {/* Hint button - only show if hint not already used */}
              {!hintUsed && (
                <div className="mb-3 flex justify-center">
                  <button
                    onClick={showHint}
                    className="bg-yellow-100 text-yellow-700 px-6 py-2 rounded-xl font-semibold text-sm active:scale-95 shadow-md border-2 border-yellow-300"
                  >
                    💡 Need a Hint? (-50% coins)
                  </button>
                </div>
              )}
              {hintUsed && hintText && (
                <div className="mb-3 mx-4 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                  <p className="text-yellow-800 font-bold text-center">💡 {hintText}</p>
                  <p className="text-yellow-600 text-xs text-center mt-1">⚠️ Coins reduced by 50%</p>
                </div>
              )}
              {currentSubject === 'maths' ? (
                <NumberPad
                  onKey={handleKey}
                  onBackspace={handleBackspace}
                  onSubmit={handleSubmit}
                  onClear={() => setInput('')}
                />
              ) : currentSubject === 'science' ? (
                <>
                  {/* Challenge Mode option for questions with acceptedConcepts */}
                  {currentWord.acceptedConcepts && !challengeMode && (
                    <div className="mb-4 text-center">
                      <button
                        onClick={() => setChallengeMode(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold text-sm active:scale-95 shadow-lg"
                      >
                        🎯 Try Challenge Mode? (+2 bonus coins!)
                      </button>
                      <p className="text-white/70 text-xs mt-2">Type your own answer - AI will mark it!</p>
                    </div>
                  )}

                  {challengeMode ? (
                    /* Challenge Mode - text input with AI marking */
                    <div className="space-y-3">
                      <div className="bg-purple-100 rounded-xl p-3 text-center">
                        <p className="text-purple-700 font-semibold text-sm">🎯 Challenge Mode - Type your answer!</p>
                        <p className="text-purple-600 text-xs">AI ignores spelling/grammar - just show you understand!</p>
                      </div>
                      {/* Answer field for Challenge Mode */}
                      <div className="bg-white border-2 border-purple-300 rounded-xl p-4">
                        <label className="text-purple-600 text-xs font-semibold uppercase tracking-wide">Your Answer</label>
                        <div className="mt-2 min-h-16 text-gray-800 text-lg leading-relaxed break-words">
                          {input || <span className="text-gray-400 italic">Start typing...</span>}
                          <span className="animate-pulse text-purple-500">|</span>
                        </div>
                      </div>
                      <Keyboard onKey={handleKey} onBackspace={handleBackspace} onSubmit={handleSubmit} />
                    </div>
                  ) : currentWord.type === 'true-false' ? (
                    /* True/False buttons */
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => { setInput('true'); }}
                        className={`p-6 rounded-2xl font-bold text-xl active:scale-95 transition-all ${input === 'true' ? 'bg-green-500 text-white ring-4 ring-green-300' : 'bg-green-100 text-green-700'}`}
                      >
                        ✓ TRUE
                      </button>
                      <button
                        onClick={() => { setInput('false'); }}
                        className={`p-6 rounded-2xl font-bold text-xl active:scale-95 transition-all ${input === 'false' ? 'bg-red-500 text-white ring-4 ring-red-300' : 'bg-red-100 text-red-700'}`}
                      >
                        ✗ FALSE
                      </button>
                      {input && (
                        <button
                          onClick={handleSubmit}
                          className="col-span-2 bg-emerald-500 text-white p-4 rounded-xl font-bold text-lg active:scale-95"
                        >
                          Submit Answer ✓
                        </button>
                      )}
                    </div>
                  ) : (
                    /* MCQ buttons */
                    <div className="space-y-3">
                      {currentWord.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setInput(String(idx)); }}
                          className={`w-full p-4 rounded-xl font-semibold text-left active:scale-98 transition-all ${input === String(idx) ? 'bg-emerald-500 text-white ring-4 ring-emerald-300' : 'bg-white text-gray-800 border-2 border-gray-200'}`}
                        >
                          <span className="inline-block w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-center leading-8 mr-3 font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {option}
                        </button>
                      ))}
                      {input && (
                        <button
                          onClick={handleSubmit}
                          className="w-full bg-emerald-500 text-white p-4 rounded-xl font-bold text-lg active:scale-95"
                        >
                          Submit Answer ✓
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : currentSubject === 'history' ? (
                <>
                  {currentWord.type === 'true-false' ? (
                    /* True/False buttons */
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => { setInput('true'); }}
                        className={`p-6 rounded-2xl font-bold text-xl active:scale-95 transition-all ${input === 'true' ? 'bg-green-500 text-white ring-4 ring-green-300' : 'bg-green-100 text-green-700'}`}
                      >
                        ✓ TRUE
                      </button>
                      <button
                        onClick={() => { setInput('false'); }}
                        className={`p-6 rounded-2xl font-bold text-xl active:scale-95 transition-all ${input === 'false' ? 'bg-red-500 text-white ring-4 ring-red-300' : 'bg-red-100 text-red-700'}`}
                      >
                        ✗ FALSE
                      </button>
                      {input && (
                        <button
                          onClick={handleSubmit}
                          className="col-span-2 bg-amber-500 text-white p-4 rounded-xl font-bold text-lg active:scale-95"
                        >
                          Submit Answer ✓
                        </button>
                      )}
                    </div>
                  ) : (
                    /* MCQ buttons - history uses text answers, not indices */
                    <div className="space-y-3">
                      {currentWord.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setInput(option); }}
                          className={`w-full p-4 rounded-xl font-semibold text-left active:scale-98 transition-all ${input === option ? 'bg-amber-500 text-white ring-4 ring-amber-300' : 'bg-white text-gray-800 border-2 border-gray-200'}`}
                        >
                          <span className="inline-block w-8 h-8 rounded-full bg-amber-100 text-amber-700 text-center leading-8 mr-3 font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {option}
                        </button>
                      ))}
                      {input && (
                        <button
                          onClick={handleSubmit}
                          className="w-full bg-amber-500 text-white p-4 rounded-xl font-bold text-lg active:scale-95"
                        >
                          Submit Answer ✓
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : currentSubject === 'spelling' && spellingMCQ ? (
                /* Spelling MCQ mode - select then submit like other subjects */
                <div className="space-y-3 px-2">
                  {spellingOptions.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(option)}
                      className={`w-full p-4 rounded-xl font-bold text-xl text-center active:scale-98 transition-all ${input === option ? 'bg-indigo-500 text-white ring-4 ring-indigo-300' : 'bg-white text-gray-800 border-2 border-indigo-200'}`}
                    >
                      <span className={`inline-block w-8 h-8 rounded-full text-center leading-8 mr-3 text-base font-bold ${input === option ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </button>
                  ))}
                  {input && (
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-green-500 text-white p-4 rounded-xl font-bold text-lg active:scale-95"
                    >
                      Submit Answer ✓
                    </button>
                  )}
                </div>
              ) : (
                <Keyboard onKey={handleKey} onBackspace={handleBackspace} onSubmit={handleSubmit} />
              )}
            </>
          ) : (
            <button onClick={nextWord} className="w-full bg-white rounded-xl p-4 font-bold text-indigo-600 text-lg active:scale-98">
              {currentIndex < testWords.length - 1 ? `Next ${currentSubject === 'spelling' ? 'Word' : 'Question'} →` : 'See Results'}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'results') {
    // Handle empty results (shouldn't happen but safety check)
    if (!results || results.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-red-500 to-orange-600 p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center max-w-md">
            <p className="text-6xl mb-4">⚠️</p>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">No Results Found</h1>
            <p className="text-gray-600 mb-6">
              Something went wrong. No test results were recorded.
              This might be a bug - please try taking the test again.
            </p>
            <button onClick={() => setScreen('home')} className="w-full bg-red-600 text-white rounded-xl p-4 font-bold">
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    const correctCount = results.filter(r => r.correct).length;
    const pct = results.length > 0 ? (correctCount / results.length) * 100 : 0;
    const totalEarned = results.reduce((a, r) => a + r.coins, 0) + (pct === 100 ? 50 : pct >= 80 ? 25 : pct >= 60 ? 10 : 5);

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-500 to-emerald-600 p-4">
        {newBadge && <BadgePopup badge={newBadge} onClose={() => setNewBadge(null)} />}
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <span className="text-6xl">{pct === 100 ? '🌟' : pct >= 60 ? '👏' : '💪'}</span>
            <h1 className="text-3xl font-bold text-white mt-4">Test Complete!</h1>
            <p className="text-white/80 text-xl mt-2">{correctCount}/{results.length} correct</p>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-6">
            {results.map((r, i) => (
              <div key={i} className={`flex items-center justify-between p-3 ${i > 0 ? 'border-t' : ''}`}>
                <div>
                  <span className={`font-bold ${r.correct ? 'text-green-600' : 'text-red-600'}`}>{r.word}</span>
                  {!r.correct && <span className="text-gray-400 text-sm ml-2">({r.attempt})</span>}
                </div>
                <span>{r.correct ? '✓' : '✗'}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/20 rounded-2xl p-4 mb-6 text-center">
            <p className="text-white font-bold text-lg">Coins Earned</p>
            <p className="text-3xl text-white">🪙 {totalEarned}</p>
          </div>

          <button onClick={() => setScreen('home')} className="w-full bg-white rounded-xl p-4 font-bold text-green-600 text-lg">Done</button>
        </div>
      </div>
    );
  }

  if (screen === 'rewards') {
    // Categorize rewards by affordability
    const canAffordRewards = sampleRewards.filter(r => {
      const claimed = claimedRewards.includes(r.id);
      const tierUnlocked = isRewardUnlocked(r, gameData);
      const canAfford = canAffordReward(r, gameData);
      return !claimed && tierUnlocked && canAfford;
    });

    const almostThereRewards = sampleRewards.filter(r => {
      const claimed = claimedRewards.includes(r.id);
      const tierUnlocked = isRewardUnlocked(r, gameData);
      const canAfford = canAffordReward(r, gameData);
      const gaps = getRewardGaps(r, gameData);
      return !claimed && tierUnlocked && !canAfford && gaps.total.gap <= 100;
    });

    const needMoreRewards = sampleRewards.filter(r => {
      const claimed = claimedRewards.includes(r.id);
      const tierUnlocked = isRewardUnlocked(r, gameData);
      const canAfford = canAffordReward(r, gameData);
      const gaps = getRewardGaps(r, gameData);
      return !claimed && tierUnlocked && !canAfford && gaps.total.gap > 100;
    });

    const lockedRewards = sampleRewards.filter(r => {
      const claimed = claimedRewards.includes(r.id);
      const tierUnlocked = isRewardUnlocked(r, gameData);
      return !claimed && !tierUnlocked;
    });

    const claimedRewardsList = sampleRewards.filter(r => claimedRewards.includes(r.id));

    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-500 to-orange-500 p-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => setScreen('home')} className="text-white/80 mb-4">← Back</button>

          <h1 className="text-2xl font-bold text-white text-center mb-4">🎁 Rewards Shop</h1>

          {/* 4-Currency Balance Display */}
          <div className="bg-white/20 rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">📚</div>
                <div className="text-xl font-bold text-white">{gameData.spelling?.coins || 0}</div>
                <div className="text-xs text-white/80">English</div>
              </div>
              <div className="bg-blue-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🔢</div>
                <div className="text-xl font-bold text-white">{gameData.maths?.coins || 0}</div>
                <div className="text-xs text-white/80">Maths</div>
              </div>
              <div className="bg-green-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🔬</div>
                <div className="text-xl font-bold text-white">{gameData.science?.coins || 0}</div>
                <div className="text-xs text-white/80">Science</div>
              </div>
              <div className="bg-amber-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">📜</div>
                <div className="text-xl font-bold text-white">{gameData.history?.coins || 0}</div>
                <div className="text-xs text-white/80">History</div>
              </div>
            </div>
          </div>

          {/* Can Afford Section */}
          {canAffordRewards.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-3">✅ You Can Claim ({canAffordRewards.length})</h2>
              {canAffordRewards.slice(0, 10).map(r => {
            const claimed = claimedRewards.includes(r.id);
            const tierUnlocked = isRewardUnlocked(r, gameData);
            const progress = getUnlockProgress(r, gameData);
            const canAfford = canAffordReward(r, gameData);
            const gaps = getRewardGaps(r, gameData);
            const canClaim = tierUnlocked && canAfford && !claimed;

            return (
              <div key={r.id} className={`bg-white rounded-2xl p-4 mb-3 ${!tierUnlocked && 'opacity-60'}`}>
                {/* Tier badge and name */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{r.icon}</span>
                    <div className="font-bold text-lg text-gray-800">{r.name}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    progress.tier === 1 ? 'bg-gray-200 text-gray-600' :
                    progress.tier === 2 ? 'bg-orange-200 text-orange-700' :
                    progress.tier === 3 ? 'bg-gray-300 text-gray-700' :
                    progress.tier === 4 ? 'bg-yellow-300 text-yellow-800' :
                    progress.tier === 5 ? 'bg-purple-300 text-purple-800' :
                    'bg-blue-300 text-blue-800'
                  }`}>
                    {progress.tierName}
                  </span>
                </div>

                {/* Simple total coins display */}
                <div className={`rounded-xl p-4 mb-3 ${gaps.total.ready ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">🪙</span>
                      <div>
                        <span className="text-2xl font-bold font-mono text-gray-800">
                          {Math.round(gaps.total.current)} / {gaps.total.needed}
                        </span>
                        <div className="text-xs text-gray-500">total coins</div>
                      </div>
                    </div>
                    {gaps.total.ready ? (
                      <span className="text-xl font-bold text-green-600">Ready! ✅</span>
                    ) : (
                      <span className="text-lg font-bold text-orange-600">Need {gaps.total.gap} more</span>
                    )}
                  </div>
                </div>

                {/* Action button */}
                {claimed ? (
                  <div className="text-center py-3 bg-purple-100 rounded-lg">
                    <span className="font-bold text-purple-600 text-lg">Claimed ✓</span>
                  </div>
                ) : !tierUnlocked ? (
                  <div className="text-center py-3 bg-red-100 rounded-lg">
                    <span className="font-bold text-red-600 text-lg">🔒 Tier Locked</span>
                  </div>
                ) : (
                  <button
                    onClick={() => claimReward(r)}
                    disabled={!canAfford}
                    className={`w-full py-3 rounded-lg font-bold text-lg ${
                      canClaim ? 'bg-green-500 text-white active:scale-95' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {canAfford ? 'Claim Reward!' : 'Not Enough Coins'}
                  </button>
                )}
              </div>
            );
          })}
            </div>
          )}

          {/* Almost There Section */}
          {almostThereRewards.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-3">🔥 Almost There ({almostThereRewards.length})</h2>
              {almostThereRewards.slice(0, 8).map(r => {
                const gaps = getRewardGaps(r, gameData);
                return (
                  <div key={r.id} className="bg-white rounded-2xl p-4 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{r.icon}</span>
                        <div>
                          <div className="font-bold text-lg text-gray-800">{r.name}</div>
                          <div className="text-sm text-gray-600">{r.cost} coins</div>
                        </div>
                      </div>
                      <div className="bg-orange-100 text-orange-700 px-3 py-2 rounded-lg text-lg font-bold">
                        Need {gaps.total.gap} 🪙
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Keep Practicing Section */}
          {needMoreRewards.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-3">🎯 Keep Practicing ({needMoreRewards.length})</h2>
              {needMoreRewards.slice(0, 5).map(r => (
                <div key={r.id} className="bg-white/50 rounded-xl p-3 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl opacity-60">{r.icon}</span>
                    <span className="font-bold text-gray-700">{r.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{r.cost} 🪙</span>
                </div>
              ))}
            </div>
          )}

          {/* Locked Section */}
          {lockedRewards.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-3">🔒 Locked ({lockedRewards.length})</h2>
              <p className="text-white/80 text-sm mb-3">Keep earning to unlock higher tiers!</p>
              {lockedRewards.slice(0, 3).map(r => (
                <div key={r.id} className="bg-white/30 rounded-xl p-3 mb-2 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl grayscale">{r.icon}</span>
                    <span className="font-bold text-white">{r.name}</span>
                  </div>
                  <span className="text-sm text-white">🔒</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'badges') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-500 to-rose-600 p-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => setScreen('home')} className="text-white/80 mb-6">← Back</button>
          <h1 className="text-2xl font-bold text-white text-center mb-6">🏆 Badges</h1>
          <div className="grid grid-cols-3 gap-3">
            {badges.map(b => {
              const earned = earnedBadges.includes(b.id);
              return (
                <div key={b.id} className={`bg-white rounded-xl p-4 text-center ${!earned && 'opacity-40 grayscale'}`}>
                  <span className="text-3xl">{b.icon}</span>
                  <p className="text-xs font-bold mt-2 text-gray-700">{b.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'progress') {
    const weeklyTarget = 250;
    const weeklyPct = Math.min(100, Math.round((stats.weeklyCoins / weeklyTarget) * 100));

    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-500 to-cyan-600 p-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => setScreen('home')} className="text-white/80 mb-6">← Back</button>
          <h1 className="text-2xl font-bold text-white text-center mb-6">📊 Progress</h1>

          <div className="bg-white rounded-2xl p-6 mb-4">
            <h2 className="font-bold text-gray-800 mb-4">Weekly Target</h2>
            <div className="bg-gray-100 rounded-full h-4 mb-2">
              <div className="bg-teal-500 rounded-full h-4 transition-all" style={{ width: `${weeklyPct}%` }} />
            </div>
            <p className="text-gray-500 text-sm">{stats.weeklyCoins} / {weeklyTarget} coins this week</p>
          </div>

          {categoryStats.length > 0 && (
            <div className="bg-white rounded-2xl p-6 mb-4">
              <h2 className="font-bold text-gray-800 mb-3">Category Accuracy</h2>
              <div className="space-y-2">
                {categoryStats.map((cat, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-gray-600">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${cat.pct < 50 ? 'bg-red-500' : cat.pct < 75 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${cat.pct}%` }} />
                      </div>
                      <span className={`font-bold text-sm ${cat.pct < 50 ? 'text-red-500' : cat.pct < 75 ? 'text-yellow-500' : 'text-green-500'}`}>{cat.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 mb-4">
            <h2 className="font-bold text-gray-800 mb-3">Stats</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div><p className="text-2xl font-bold text-teal-600">{stats.testsDone}</p><p className="text-gray-500 text-sm">Tests Done</p></div>
              <div><p className="text-2xl font-bold text-teal-600">{stats.avgScore}%</p><p className="text-gray-500 text-sm">Avg Score</p></div>
              <div><p className="text-2xl font-bold text-teal-600">{streak}</p><p className="text-gray-500 text-sm">Day Streak</p></div>
              <div><p className="text-2xl font-bold text-teal-600">{bestStreak}</p><p className="text-gray-500 text-sm">Best Streak</p></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <h2 className="font-bold text-gray-800 mb-3">All Time</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div><p className="text-2xl font-bold text-teal-600">{totalCoinsEarned}</p><p className="text-gray-500 text-sm">Total Coins</p></div>
              <div><p className="text-2xl font-bold text-teal-600">{earnedBadges.length}</p><p className="text-gray-500 text-sm">Badges</p></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Settings component (separate to avoid useState rules violation)
function SettingsScreen({ ttsService, onBack, onOpenDashboard, spellingMode, setSpellingMode }) {
  const [pinVerified, setPinVerified] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSaved, setPinSaved] = useState(false);

  if (!pinVerified) {
    return <PinEntry onSuccess={() => setPinVerified(true)} onBack={onBack} />;
  }

  const handlePinSave = () => {
    if (newPin.length === 4 && /^\d{4}$/.test(newPin)) {
      localStorage.setItem('parent_pin', newPin);
      setPinSaved(true);
      setNewPin('');
      setTimeout(() => setPinSaved(false), 2000);
    } else {
      alert('PIN must be exactly 4 digits');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-700 to-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="text-white/80 mb-6">← Back</button>
        <h1 className="text-2xl font-bold text-white text-center mb-6">⚙️ Settings</h1>

        <div className="bg-white rounded-2xl p-6 mb-4">
          <h2 className="font-bold text-gray-800 mb-4">📊 Parent Dashboard</h2>
          <button onClick={onOpenDashboard} className="w-full py-3 rounded-lg font-bold text-white bg-purple-600 active:scale-98">
            View Detailed Report
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-4">
          <h2 className="font-bold text-gray-800 mb-2">🔒 Change Dashboard PIN</h2>
          <p className="text-gray-600 text-sm mb-4">4-digit PIN for parent access (current: {localStorage.getItem('parent_pin') || '1234'})</p>
          <input
            type="number"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            placeholder="Enter new 4-digit PIN"
            maxLength={4}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none mb-3 text-center text-2xl font-mono"
          />
          <button onClick={handlePinSave} className={`w-full py-3 rounded-lg font-bold text-white ${pinSaved ? 'bg-green-500' : 'bg-orange-500'} active:scale-98`}>
            {pinSaved ? '✓ PIN Changed!' : 'Save New PIN'}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-4">
          <h2 className="font-bold text-gray-800 mb-2">📚 Spelling Mode</h2>
          <p className="text-gray-600 text-sm mb-4">Choose how spelling tests work</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { setSpellingMode('type-in'); localStorage.setItem('spelling_mode', 'type-in'); setSaved(true); setTimeout(() => setSaved(false), 1500); }}
              className={`p-3 rounded-xl font-bold transition-all text-sm ${spellingMode === 'type-in' ? 'bg-indigo-500 text-white ring-4 ring-indigo-300' : 'bg-gray-100 text-gray-700'}`}
            >
              ⌨️ Type-In
              <span className="block text-xs font-normal mt-1">Spell words</span>
            </button>
            <button
              onClick={() => { setSpellingMode('multiple-choice'); localStorage.setItem('spelling_mode', 'multiple-choice'); setSaved(true); setTimeout(() => setSaved(false), 1500); }}
              className={`p-3 rounded-xl font-bold transition-all text-sm ${spellingMode === 'multiple-choice' ? 'bg-purple-500 text-white ring-4 ring-purple-300' : 'bg-gray-100 text-gray-700'}`}
            >
              🔘 MCQ
              <span className="block text-xs font-normal mt-1">Pick correct</span>
            </button>
            <button
              onClick={() => { setSpellingMode('mixed'); localStorage.setItem('spelling_mode', 'mixed'); setSaved(true); setTimeout(() => setSaved(false), 1500); }}
              className={`p-3 rounded-xl font-bold transition-all text-sm ${spellingMode === 'mixed' ? 'bg-green-500 text-white ring-4 ring-green-300' : 'bg-gray-100 text-gray-700'}`}
            >
              🔀 Mixed
              <span className="block text-xs font-normal mt-1">Both (50/50)</span>
            </button>
          </div>
          {saved && <p className="text-green-600 text-center mt-3 font-semibold">✓ Mode updated!</p>}
        </div>

        <div className="bg-white rounded-2xl p-6 mb-4">
          <h2 className="font-bold text-gray-800 mb-2">🔊 Voice Settings</h2>
          <p className="text-gray-600 text-sm mb-4">Choose how questions are read aloud</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { ttsService.setMode('browser'); setSaved(true); setTimeout(() => setSaved(false), 1500); }}
              className={`p-3 rounded-xl font-bold transition-all text-sm ${ttsService.getMode() === 'browser' ? 'bg-blue-500 text-white ring-4 ring-blue-300' : 'bg-gray-100 text-gray-700'}`}
            >
              📱 Browser
              <span className="block text-xs font-normal mt-1">Free, instant</span>
            </button>
            <button
              onClick={() => { ttsService.setMode('openai'); setSaved(true); setTimeout(() => setSaved(false), 1500); }}
              className={`p-3 rounded-xl font-bold transition-all text-sm ${ttsService.getMode() === 'openai' ? 'bg-purple-500 text-white ring-4 ring-purple-300' : 'bg-gray-100 text-gray-700'}`}
            >
              🤖 OpenAI
              <span className="block text-xs font-normal mt-1">Slow, quality</span>
            </button>
            <button
              onClick={() => { ttsService.setMode('elevenlabs'); setSaved(true); setTimeout(() => setSaved(false), 1500); }}
              className={`p-3 rounded-xl font-bold transition-all text-sm ${ttsService.getMode() === 'elevenlabs' ? 'bg-green-500 text-white ring-4 ring-green-300' : 'bg-gray-100 text-gray-700'}`}
            >
              🎙️ ElevenLabs
              <span className="block text-xs font-normal mt-1">Fast, natural</span>
            </button>
          </div>
          {saved && <p className="text-green-600 text-center mt-3 font-semibold">✓ Voice updated!</p>}

          {/* ElevenLabs API Key input - only show if NO baked-in key */}
          {ttsService.getMode() === 'elevenlabs' && !ttsService.hasElevenLabsApiKey() && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <label className="text-green-800 text-xs font-semibold block mb-2">ElevenLabs API Key</label>
              <input
                type="password"
                placeholder="Enter API key..."
                defaultValue={ttsService.getElevenLabsApiKey() || ''}
                onChange={(e) => ttsService.setElevenLabsApiKey(e.target.value)}
                className="w-full p-2 rounded border text-sm"
              />
              <p className="text-green-600 text-xs mt-1">Get key from elevenlabs.io</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 mb-4">
          <h2 className="font-bold text-gray-800 mb-2">☁️ Cloud Sync</h2>
          <div className="p-3 bg-green-50 rounded-lg mb-3">
            <p className="text-green-700 text-sm font-semibold">✓ Auto-syncing to GitHub</p>
            <p className="text-green-600 text-xs mt-1">Your progress is automatically backed up</p>
          </div>
          <button
            onClick={() => {
              const data = {};
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                data[key] = localStorage.getItem(key);
              }
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `alba-backup-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full py-3 rounded-lg font-bold text-white bg-blue-600 active:scale-98"
          >
            📥 Download Backup
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-4">
          <h2 className="font-bold text-gray-800 mb-2">♿ Accessibility Settings</h2>
          <p className="text-gray-600 text-sm mb-4">Dyslexia-friendly options</p>

          {/* Font Family */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 block mb-2">Font</label>
            <select
              value={localStorage.getItem('dyslexia_font') || 'default'}
              onChange={(e) => {
                localStorage.setItem('dyslexia_font', e.target.value);
                document.body.style.fontFamily = e.target.value === 'opendyslexic' ? 'OpenDyslexic, sans-serif' :
                                                  e.target.value === 'comic-sans' ? 'Comic Sans MS, cursive' :
                                                  e.target.value === 'lexend' ? 'Lexend, sans-serif' : '';
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
              }}
              className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-500"
            >
              <option value="default">Default (System)</option>
              <option value="opendyslexic">OpenDyslexic</option>
              <option value="comic-sans">Comic Sans</option>
              <option value="lexend">Lexend</option>
            </select>
          </div>

          {/* Text Size */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 block mb-2">Text Size</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'medium', label: 'Medium', size: '16px' },
                { id: 'large', label: 'Large', size: '18px' },
                { id: 'xlarge', label: 'X-Large', size: '20px' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    localStorage.setItem('dyslexia_text_size', opt.size);
                    document.body.style.fontSize = opt.size;
                    setSaved(true);
                    setTimeout(() => setSaved(false), 1500);
                  }}
                  className={`p-2 rounded-lg font-bold text-sm ${
                    (localStorage.getItem('dyslexia_text_size') || '16px') === opt.size
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 block mb-2">Background</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'white', label: 'White', color: '#FFFFFF' },
                { id: 'cream', label: 'Cream', color: '#FFF8E7' },
                { id: 'mint', label: 'Mint', color: '#E8F5E9' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    localStorage.setItem('dyslexia_bg', opt.color);
                    document.body.style.backgroundColor = opt.color;
                    setSaved(true);
                    setTimeout(() => setSaved(false), 1500);
                  }}
                  className={`p-2 rounded-lg font-bold text-sm border-2 ${
                    (localStorage.getItem('dyslexia_bg') || '#FFFFFF') === opt.color
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: opt.color }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Spacing */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 block mb-2">Line Spacing</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: 'Normal', value: '1.5' },
                { id: 'relaxed', label: 'Relaxed', value: '1.75' },
                { id: 'loose', label: 'Loose', value: '2.0' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    localStorage.setItem('dyslexia_line_height', opt.value);
                    document.body.style.lineHeight = opt.value;
                    setSaved(true);
                    setTimeout(() => setSaved(false), 1500);
                  }}
                  className={`p-2 rounded-lg font-bold text-sm ${
                    (localStorage.getItem('dyslexia_line_height') || '1.5') === opt.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {saved && <p className="text-green-600 text-center mt-3 font-semibold">✓ Settings saved!</p>}
        </div>

        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-bold text-gray-800 mb-2">Audio Cache</h2>
          <button onClick={() => { ttsService.clearCache(); alert('Cache cleared!'); }} className="w-full py-3 rounded-lg font-bold text-red-600 bg-red-50 active:scale-98">Clear Audio Cache</button>
        </div>
      </div>
    </div>
  );
}

// PIN Entry component
function PinEntry({ onSuccess, onBack }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const storedPin = localStorage.getItem('parent_pin') || '1234'; // Default PIN

  const handleNumberClick = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        // Check PIN
        setTimeout(() => {
          if (newPin === storedPin) {
            onSuccess();
          } else {
            setError(true);
            setPin('');
            setTimeout(() => setError(false), 1000);
          }
        }, 100);
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-700 to-gray-900 p-4 flex items-center justify-center">
      <div className="max-w-sm w-full">
        <button onClick={onBack} className="text-white/80 mb-6">← Back</button>
        <div className="bg-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🔒 Parent Access</h2>
          <p className="text-gray-600 mb-6 text-sm">Enter PIN to view dashboard</p>

          {/* PIN Display */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold border-2 ${
                error ? 'bg-red-50 border-red-500 text-red-500' :
                pin.length > i ? 'bg-purple-600 border-purple-600 text-white' :
                'bg-gray-100 border-gray-300 text-gray-400'
              }`}>
                {pin.length > i ? '●' : '○'}
              </div>
            ))}
          </div>

          {error && <p className="text-red-600 font-semibold mb-4">Incorrect PIN</p>}

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg h-16 text-2xl font-bold text-gray-800"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg h-16 text-lg font-bold text-gray-600"
            >
              Clear
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg h-16 text-2xl font-bold text-gray-800"
            >
              0
            </button>
            <div></div>
          </div>

          <p className="text-xs text-gray-400 mt-4">Default PIN: 1234<br/>Change in Settings</p>
        </div>
      </div>
    </div>
  );
}

// Parent Dashboard component
function ParentDashboard({ gameData, onBack }) {
  const [pinVerified, setPinVerified] = useState(false);
  const [activeTab, setActiveTab] = useState('english');

  if (!pinVerified) {
    return <PinEntry onSuccess={() => setPinVerified(true)} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-700 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="text-white/80 mb-4">← Back</button>
        <h1 className="text-3xl font-bold text-white text-center mb-6">📊 Parent Dashboard</h1>

        {/* Tabbed Interface */}
        <div className="bg-white/10 rounded-2xl p-2 mb-6 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('english')}
            className={`flex-1 min-w-fit px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'english'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-white/20 text-white/70 hover:bg-white/30'
            }`}
          >
            📚 English
          </button>
          <button
            onClick={() => setActiveTab('maths')}
            className={`flex-1 min-w-fit px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'maths'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white/20 text-white/70 hover:bg-white/30'
            }`}
          >
            🔢 Maths
          </button>
          <button
            onClick={() => setActiveTab('science')}
            className={`flex-1 min-w-fit px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'science'
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'bg-white/20 text-white/70 hover:bg-white/30'
            }`}
          >
            🔬 Science
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 min-w-fit px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'bg-white/20 text-white/70 hover:bg-white/30'
            }`}
          >
            📜 History
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 min-w-fit px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'notes'
                ? 'bg-pink-500 text-white shadow-lg'
                : 'bg-white/20 text-white/70 hover:bg-white/30'
            }`}
          >
            📝 Notes
          </button>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'english' && (
          <EnglishReportDashboard
            gameData={gameData}
            allWords={allWords}
            categoryNames={categoryNames}
          />
        )}
        {activeTab === 'maths' && (
          <MathsReportDashboard
            gameData={gameData}
            mathsQuestions={mathsQuestions}
            mathsTopicNames={mathsTopicNames}
          />
        )}
        {activeTab === 'science' && (
          <ScienceReportDashboard
            gameData={gameData}
            scienceQuestions={scienceQuestions}
            scienceTopicNames={scienceTopicNames}
          />
        )}
        {activeTab === 'history' && (
          <HistoryReportDashboard
            gameData={gameData}
            historyQuestions={historyQuestions}
            historyTopicNames={historyTopicNames}
          />
        )}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Parent Notes</h2>
              <p className="text-gray-600 mb-4">Track observations about Alba's learning</p>

              {gameData.parentNotes && gameData.parentNotes.length > 0 ? (
                <div className="space-y-3">
                  {gameData.parentNotes.slice().reverse().map((note, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${
                          note.type === 'celebration' ? 'text-green-600' :
                          note.type === 'concern' ? 'text-red-600' :
                          note.type === 'question' ? 'text-blue-600' :
                          'text-gray-700'
                        }`}>
                          {note.type === 'celebration' ? '🎉' :
                           note.type === 'concern' ? '⚠️' :
                           note.type === 'question' ? '❓' : '📝'} {note.type}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(note.date).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-1">{note.title}</h3>
                      <p className="text-gray-600 text-sm">{note.content}</p>
                      {note.subject && (
                        <div className="mt-2 text-xs text-gray-500">Subject: {note.subject}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-gray-500">No notes yet</p>
                  <p className="text-xs text-gray-400 mt-1">Full note creation coming soon</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

