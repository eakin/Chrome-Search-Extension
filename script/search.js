$(document).ready(function() {
	console.log("popup is ready");
});


var _editDistanceMax = 3;
var _suggestionDistance = 1; // show all suggestion of smallerDistance


////////////////////////JAVASCRIPT FUNCTIONS////////////////////////

function hashCode (str){
    var hash = 0, i, char;
    if (str.length == 0) return hash;
    for (i = 0, l = str.length; i < l; i++) {
        char  = str.charCodeAt(i);
        hash  = ((hash<<5)-hash)+char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

///////////////////////END OF FUNCTIONS////////////////////////////

var dictionaryItem = function() {
	   	var term = "";
        var suggestions;

        var count = 0;
 
        function Equals(obj) {
            return Equals(term, obj.term);
        }
      
        function GetHashCode() {
            return hashCode(term);
        }
}

var editItem = function() {
    var term = "";
    var distance = 0;

    function Equals(obj)
    {
        return Equals(term, obj.term);
    }
  
    function GetHashCode()
    {
        return hashCode(term);
    }       
}


var suggestItem = function() {
    var term = "";
    var distance = 0;
    var count = 0;

    function Equals(obj)
    {
        return Equals(term, obj.term);
    }
  
    function GetHashCode()
    {
        return hashCode(term);
    }       
}

var Dictionary = {
	var _str,
	var _dicItem,
	init: function(str, dicItem) {
		this._str = str;
		this._dicItem = dicItem; 
	}
};
var dictionary = new Array();
 
function parseWords(text)
{
    var myArray = text.match(/[\w-[\d_]]+/g);
    console.log(myArray[0]);
    return myArray; 
}

function CreateDictionaryEntry(key, language)
{
    var result = false;
    dictionaryItem value;
    if (dictionary[language+key])
    {
        value = dictionary[language+key];
        //already exists:
        //1. word appears several times
        //2. word1==deletes(word2) 
        value.count++;
    }
    else
    {
        value = new dictionaryItem();
        value.count++;
        dictionary[language+key].push(value);
    }

    //edits/suggestions are created only once, no matter how often word occurs
    //edits/suggestions are created only as soon as the word occurs in the corpus, 
    //even if the same term existed before in the dictionary as an edit from another word
    if (!value.term)
    {
        result = true;
        value.term = key;

        //create deletes
        for (delete in Edits(key, 0, true))
        {
            editItem suggestion = new editItem();
            suggestion.term = key;
            suggestion.distance = delete.distance;

            dictionaryItem value2;
            if (dictionary[language+key])
            {
                value2 = dictionary[language+key];
                //already exists:
                //1. word1==deletes(word2) 
                //2. deletes(word1)==deletes(word2) 
                if (value2.suggestions.indexOf(suggestion) == -1) AddLowestDistance(value2.suggestions, suggestion);
            }
            else
            {
                value2 = new dictionaryItem();
                value2.suggestions.push(suggestion);
                dictionary[language+delete.term].push(value2)
            }
        }
    }
    return result;
}



    //create a frequency disctionary from a corpus
    private static void CreateDictionary(string corpus, string language)
    {
        if (!File.Exists(corpus))
        {
            Console.Error.WriteLine("File not found: " + corpus);
            return;
        }
 
        Console.Write("Creating dictionary ...");
        long wordCount = 0;
        foreach (string key in parseWords(File.ReadAllText(corpus)))
        {
            if (CreateDictionaryEntry(key, language)) wordCount++;
        }
        Console.WriteLine("\rDictionary created: " + wordCount.ToString("N0") + " words, " + dictionary.Count.ToString("N0") + " entries, for edit distance=" + editDistanceMax.ToString());
    }
 
    //save some time and space
    private static void AddLowestDistance(List<editItem> suggestions, editItem suggestion)
    {
        //remove all existing suggestions of higher distance, if verbose<2
        if ((verbose < 2) && (suggestions.Count > 0) && (suggestions[0].distance > suggestion.distance)) suggestions.Clear();
        //do not add suggestion of higher distance than existing, if verbose<2
        if ((verbose == 2) || (suggestions.Count == 0) || (suggestions[0].distance >= suggestion.distance)) suggestions.Add(suggestion);
    }
 
    //inexpensive and language independent: only deletes, no transposes + replaces + inserts
    //replaces and inserts are expensive and language dependent (Chinese has 70,000 Unicode Han characters)
    private static List<editItem> Edits(string word, int editDistance, bool recursion)
    {
        editDistance++;
        List<editItem> deletes = new List<editItem>();
        if (word.Length > 1)
        {
            for (int i = 0; i < word.Length; i++)
            {
                editItem delete = new editItem();
                delete.term=word.Remove(i, 1);
                delete.distance=editDistance;
                if (!deletes.Contains(delete))
                {
                    deletes.Add(delete);
                    //recursion, if maximum edit distance not yet reached
                    if (recursion && (editDistance < editDistanceMax)) 
                    {
                        foreach (editItem edit1 in Edits(delete.term, editDistance,recursion))
                        {
                            if (!deletes.Contains(edit1)) deletes.Add(edit1); 
                        }
                    }                   
                }
            }
        }
 
        return deletes;
    }
 
//     private static int TrueDistance(editItem dictionaryOriginal, editItem inputDelete, string inputOriginal)
//     {
//         //We allow simultaneous edits (deletes) of editDistanceMax on on both the dictionary and the input term. 
//         //For replaces and adjacent transposes the resulting edit distance stays <= editDistanceMax.
//         //For inserts and deletes the resulting edit distance might exceed editDistanceMax.
//         //To prevent suggestions of a higher edit distance, we need to calculate the resulting edit distance, if there are simultaneous edits on both sides.
//         //Example: (bank==bnak and bank==bink, but bank!=kanb and bank!=xban and bank!=baxn for editDistanceMaxe=1)
//         //Two deletes on each side of a pair makes them all equal, but the first two pairs have edit distance=1, the others edit distance=2.
 
//         if (dictionaryOriginal.term == inputOriginal) return 0; else
//         if (dictionaryOriginal.distance == 0) return inputDelete.distance;
//         else if (inputDelete.distance == 0) return dictionaryOriginal.distance;
//         else return DamerauLevenshteinDistance(dictionaryOriginal.term, inputOriginal);//adjust distance, if both distances>0
//     }
 
//     private static List<suggestItem> Lookup(string input, string language, int editDistanceMax)
//     {
//         List<editItem> candidates = new List<editItem>();
 
//         //add original term
//         editItem item = new editItem();
//         item.term = input;
//         item.distance = 0;
//         candidates.Add(item);
  
//         List<suggestItem> suggestions = new List<suggestItem>();
//         dictionaryItem value;
 
//         while (candidates.Count>0)
//         {
//             editItem candidate = candidates[0];
//             candidates.RemoveAt(0);
 
//             //save some time
//             //early termination
//             //suggestion distance=candidate.distance... candidate.distance+editDistanceMax                
//             //if canddate distance is already higher than suggestion distance, than there are no better suggestions to be expected
//             if ((verbose < 2)&&(suggestions.Count > 0)&&(candidate.distance > suggestions[0].distance)) goto sort;
//             if (candidate.distance > editDistanceMax) goto sort;  
 
//             if (dictionary.TryGetValue(language+candidate.term, out value))
//             {
//                 if (!string.IsNullOrEmpty(value.term))
//                 {
//                     //correct term
//                     suggestItem si = new suggestItem();
//                     si.term = value.term;
//                     si.count = value.count;
//                     si.distance = candidate.distance;
 
//                     if (!suggestions.Contains(si))
//                     {
//                         suggestions.Add(si);
//                         //early termination
//                         if ((verbose < 2) && (candidate.distance == 0)) goto sort;     
//                     }
//                 }
 
//                 //edit term (with suggestions to correct term)
//                 dictionaryItem value2;
//                 foreach (editItem suggestion in value.suggestions)
//                 {
//                     //save some time 
//                     //skipping double items early
//                     if (suggestions.Find(x => x.term == suggestion.term) == null)
//                     {
//                         int distance = TrueDistance(suggestion, candidate, input);
                      
//                         //save some time.
//                         //remove all existing suggestions of higher distance, if verbose<2
//                         if ((verbose < 2) && (suggestions.Count > 0) && (suggestions[0].distance > distance)) suggestions.Clear();
//                         //do not process higher distances than those already found, if verbose<2
//                         if ((verbose < 2) && (suggestions.Count > 0) && (distance > suggestions[0].distance)) continue;
 
//                         if (distance <= editDistanceMax)
//                         {
//                             if (dictionary.TryGetValue(language+suggestion.term, out value2))
//                             {
//                                 suggestItem si = new suggestItem();
//                                 si.term = value2.term;
//                                 si.count = value2.count;
//                                 si.distance = distance;
 
//                                 suggestions.Add(si);
//                             }
//                         }
//                     }
//                 }
//             }//end foreach
 
//             //add edits 
//             if (candidate.distance < editDistanceMax)
//             {
//                 foreach (editItem delete in Edits(candidate.term, candidate.distance,false))
//                 {
//                     if (!candidates.Contains(delete)) candidates.Add(delete);
//                 }
//             }
//         }//end while
 
//         sort: suggestions = suggestions.OrderBy(c => c.distance).ThenByDescending(c => c.count).ToList();
//         if ((verbose == 0)&&(suggestions.Count>1))  return suggestions.GetRange(0, 1); else return suggestions;
//     }
 
//     private static void Correct(string input, string language)
//     {
//         List<suggestItem> suggestions = null;
     
//         /*
//         //Benchmark: 1000 x Lookup
//         Stopwatch stopWatch = new Stopwatch();
//         stopWatch.Start();
//         for (int i = 0; i < 1000; i++)
//         {
//             suggestions = Lookup(input,language,editDistanceMax);
//         }
//         stopWatch.Stop();
//         Console.WriteLine(stopWatch.ElapsedMilliseconds.ToString());
//         */
         
//         //check in dictionary for existence and frequency; sort by edit distance, then by word frequency
//         suggestions = Lookup(input, language, editDistanceMax);
 
//         //display term and frequency
//         foreach (var suggestion in suggestions)
//         {
//             Console.WriteLine( suggestion.term + " " + suggestion.distance.ToString() + " " + suggestion.count.ToString());
//         }
//         if (verbose == 2) Console.WriteLine(suggestions.Count.ToString() + " suggestions");
//     }
 
//     private static void ReadFromStdIn()
//     {
//         string word;
//         while (!string.IsNullOrEmpty(word = (Console.ReadLine() ?? "").Trim()))
//         {
//             Correct(word,"en");
//         }
//     }
 
//     public static void Main(string[] args)
//     {
//         //e.g. http://norvig.com/big.txt , or any other large text corpus
//         CreateDictionary("big.txt","en");
//         ReadFromStdIn();
//     }
 
//     // Damerau–Levenshtein distance algorithm and code 
//     // from http://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance
//     public static Int32 DamerauLevenshteinDistance(String source, String target)
//     {
//         Int32 m = source.Length;
//         Int32 n = target.Length;
//         Int32[,] H = new Int32[m + 2, n + 2];
 
//         Int32 INF = m + n;
//         H[0, 0] = INF;
//         for (Int32 i = 0; i <= m; i++) { H[i + 1, 1] = i; H[i + 1, 0] = INF; }
//         for (Int32 j = 0; j <= n; j++) { H[1, j + 1] = j; H[0, j + 1] = INF; }
 
//         SortedDictionary<Char, Int32> sd = new SortedDictionary<Char, Int32>();
//         foreach (Char Letter in (source + target))
//         {
//             if (!sd.ContainsKey(Letter))
//                 sd.Add(Letter, 0);
//         }
 
//         for (Int32 i = 1; i <= m; i++)
//         {
//             Int32 DB = 0;
//             for (Int32 j = 1; j <= n; j++)
//             {
//                 Int32 i1 = sd[target[j - 1]];
//                 Int32 j1 = DB;
 
//                 if (source[i - 1] == target[j - 1])
//                 {
//                     H[i + 1, j + 1] = H[i, j];
//                     DB = j;
//                 }
//                 else
//                 {
//                     H[i + 1, j + 1] = Math.Min(H[i, j], Math.Min(H[i + 1, j], H[i, j + 1])) + 1;
//                 }
 
//                 H[i + 1, j + 1] = Math.Min(H[i + 1, j + 1], H[i1, j1] + (i - i1 - 1) + 1 + (j - j1 - 1));
//             }
 
//             sd[ source[ i - 1 ]] = i;
//         }
//         return H[m + 1, n + 1];
//     }
// }



