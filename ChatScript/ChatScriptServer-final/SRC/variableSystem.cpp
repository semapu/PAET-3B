// variableSystem.cpp - manage user variables ($variables)

#include "common.h"

#ifdef INFORMATION
There are 5 kinds of variables.
	1. User variables beginning wih $ (regular and transient which begin with $$)
	2. Wildcard variables beginning with _
	3. Fact sets beginning with @ 
	4. Function variables beginning with ^ 
	5. System variables beginning with % 
#endif

int impliedSet = ALREADY_HANDLED;	// what fact set is involved in operation
int impliedWild = ALREADY_HANDLED;	// what wildcard is involved in operation
char impliedOp = 0;					// for impliedSet, what op is in effect += = 

int wildcardIndex = 0;
char wildcardOriginalText[MAX_WILDCARDS+1][MAX_USERVAR_SIZE+1];  // spot wild cards can be stored
char wildcardCanonicalText[MAX_WILDCARDS+1][MAX_USERVAR_SIZE+1];  // spot wild cards can be stored
unsigned int wildcardPosition[MAX_WILDCARDS+1]; // spot it started and ended in sentence
char wildcardSeparator[2];

//   list of active variables needing saving

WORDP userVariableList[MAX_USER_VARS];	// variables read in from user file
WORDP botVariableList[MAX_USER_VARS];	// variables created by bot load
static char* baseVariableValues[MAX_USER_VARS];
unsigned int userVariableIndex;
unsigned int botVariableIndex;

void InitVariableSystem()
{
	*wildcardSeparator = ' ';
	wildcardSeparator[1] = 0;
	botVariableIndex = userVariableIndex = 0;
}

int GetWildcardID(char* x) // wildcard id is "_10" or "_3"
{
	if (!IsDigit(x[1])) return ILLEGAL_MATCHVARIABLE;
	unsigned int n = x[1] - '0';
	char c = x[2];
	if (IsDigit(c)) n =  (n * 10) + (c - '0');
	return (n > MAX_WILDCARDS) ? ILLEGAL_MATCHVARIABLE : n; 
}

static void CompleteWildcard()
{
	WORDP D = FindWord(wildcardCanonicalText[wildcardIndex]);
	if (D && D->properties & D->internalBits & UPPERCASE_HASH)  // but may not be found if original has plural or such or if uses _
	{
		strcpy(wildcardCanonicalText[wildcardIndex],D->word);
	}

    ++wildcardIndex;
	if (wildcardIndex > MAX_WILDCARDS) wildcardIndex = 0; 
}

void SetWildCard(int start, int end, bool inpattern)
{
	if (end < start) end = start;				// matched within a token
	if (end > wordCount)
	{
		if (start != end) end = wordCount; // for start==end we allow being off end, eg _>
		else start = end = wordCount;
	}
	while (unmarked[start]) ++start; // skip over unmarked words at start
	while (unmarked[end]) --end; // skip over unmarked words at end
    wildcardPosition[wildcardIndex] = start | (end << 16);
    *wildcardOriginalText[wildcardIndex] = 0;
    *wildcardCanonicalText[wildcardIndex] = 0;
    if (start == 0 || wordCount == 0 || (end == 0 && start != 1) ) // null match, like _{ .. }
	{
		++wildcardIndex;
		if (wildcardIndex > MAX_WILDCARDS) wildcardIndex = 0; 
	}
	else // did match
	{
		// concatenate the match value
		bool started = false;
		for (int i = start; i <= end; ++i)
		{
			if (unmarked[i]) continue; // ignore words masked
			char* word = wordStarts[i];
			// if (*word == ',') continue; // DONT IGNORE COMMAS, needthem
			if (started) 
			{
				strcat(wildcardOriginalText[wildcardIndex],wildcardSeparator);
				strcat(wildcardCanonicalText[wildcardIndex],wildcardSeparator);
			}
			else started = true;
			strcat(wildcardOriginalText[wildcardIndex],word);
			if (wordCanonical[i]) strcat(wildcardCanonicalText[wildcardIndex],wordCanonical[i]);
			else strcat(wildcardCanonicalText[wildcardIndex],word);
		}
 		if (trace & TRACE_OUTPUT && !inpattern && CheckTopicTrace()) Log(STDTRACELOG,(char*)"_%d=%s/%s ",wildcardIndex,wildcardOriginalText[wildcardIndex],wildcardCanonicalText[wildcardIndex]);
		CompleteWildcard();
	}
}

void SetWildCardGiven(int start, int end, bool inpattern, int index)
{
	if (end < start) end = start;				// matched within a token
	if (end > wordCount)
	{
		if (start != end) end = wordCount + 1; // for start==end we allow being off end, eg _>
		else start = end = wordCount + 1;
	}
    *wildcardOriginalText[index] = 0;
    *wildcardCanonicalText[index] = 0;
 	while (unmarked[start]) ++start; // skip over unmarked words at start
	while (unmarked[end]) --end; // skip over unmarked words at end
	wildcardPosition[index] = start | (end << 16);
    if (start == 0 || wordCount == 0 || (end == 0 && start != 1) ) // null match, like _{ .. }
	{
	}
	else // did match
	{
		// concatenate the match value
		bool started = false;
		for (int i = start; i <= end; ++i)
		{
			if (i < 1 || i > wordCount) continue;	// ignore off end
			if (unmarked[i]) continue;
			char* word = wordStarts[i];
			// if (*word == ',') continue; // DONT IGNORE COMMAS, needthem
			if (started) 
			{
				strcat(wildcardOriginalText[index],wildcardSeparator);
				strcat(wildcardCanonicalText[index],wildcardSeparator);
			}
			else started = true;
			strcat(wildcardOriginalText[index],word);
			if (wordCanonical[i]) strcat(wildcardCanonicalText[index],wordCanonical[i]);
			else 
				strcat(wildcardCanonicalText[index],word);
		}
 		if (trace & TRACE_OUTPUT && !inpattern && CheckTopicTrace()) Log(STDTRACELOG,(char*)"_%d=%s/%s ",index,wildcardOriginalText[index],wildcardCanonicalText[index]);
		WORDP D = FindWord(wildcardCanonicalText[index]);
		if (D && D->properties & D->internalBits & UPPERCASE_HASH)  // but may not be found if original has plural or such or if uses _
		{
			strcpy(wildcardCanonicalText[index],D->word);
		}
	}
 }

void SetWildCardNull()
{
	SetWildCardGivenValue((char*)"", (char*)"",0,0, wildcardIndex);
	CompleteWildcard();
}

void SetWildCardGivenValue(char* original, char* canonical,int start, int end, int index)
{
	if (end < start) end = start;				// matched within a token
	if (end > wordCount && start != end) end = wordCount; // for start==end we allow being off end, eg _>
    wildcardPosition[index] = start | (end << 16);
    *wildcardOriginalText[index] = 0;
    *wildcardCanonicalText[index] = 0;
    if (start == 0 || wordCount == 0 || (end == 0 && start != 1) ) // null match, like _{ .. }
	{
	}
	else // did match
	{
		// concatenate the match value
		bool started = false;
		for (int i = start; i <= end; ++i)
		{
			char* word = wordStarts[i];
			// if (*word == ',') continue; // DONT IGNORE COMMAS, needthem
			if (started) 
			{
				strcat(wildcardOriginalText[index],wildcardSeparator);
				strcat(wildcardCanonicalText[index],wildcardSeparator);
			}
			else started = true;
			strcat(wildcardOriginalText[index],word);
			if (wordCanonical[i]) strcat(wildcardCanonicalText[index],wordCanonical[i]);
			else 
				strcat(wildcardCanonicalText[index],word);
		}
 		if (trace & TRACE_OUTPUT && CheckTopicTrace()) Log(STDTRACELOG,(char*)"_%d=%s/%s ",index,wildcardOriginalText[index],wildcardCanonicalText[index]);
		WORDP D = FindWord(wildcardCanonicalText[index]);
		if (D && D->properties & D->internalBits & UPPERCASE_HASH)  // but may not be found if original has plural or such or if uses _
		{
			strcpy(wildcardCanonicalText[index],D->word);
		}
	}
}

void SetWildCardIndexStart(int index)
{
	 wildcardIndex = index;
}

void SetWildCard(char* value, char* canonicalValue,const char* index,unsigned int position)
{
	// adjust values to assign
	if (!value) value = "";
	if (!canonicalValue) canonicalValue = "";
    if (strlen(value) > MAX_USERVAR_SIZE) 
	{
		value[MAX_USERVAR_SIZE] = 0;
		ReportBug((char*)"Too long matchvariable original value %s",value)
	}
     if (strlen(canonicalValue) > MAX_USERVAR_SIZE) 
	{
		canonicalValue[MAX_USERVAR_SIZE] = 0;
		ReportBug((char*)"Too long matchvariable ng canonnical value %s",value)
	}
	while (value[0] == ' ') ++value; 
    while (canonicalValue && canonicalValue[0] == ' ') ++canonicalValue;

	// store the values
	if (index) wildcardIndex = GetWildcardID((char*)index); 
    strcpy(wildcardOriginalText[wildcardIndex],value);
    strcpy(wildcardCanonicalText[wildcardIndex],(canonicalValue) ? canonicalValue : value);
    wildcardPosition[wildcardIndex] = position | (position << 16); 
  
	CompleteWildcard();
}

char* GetwildcardText(unsigned int i, bool canon)
{
	if (i > MAX_WILDCARDS) return "";
    return canon ? wildcardCanonicalText[i] : wildcardOriginalText[i];
}

char* GetUserVariable(const char* word,bool nojson)
{
	int len = 0;
	const char* dot = (nojson) ? (const char*) NULL : strchr(word,'.');
	if (dot) len = dot - word;

	WORDP D = FindWord((char*) word,len,LOWERCASE_LOOKUP);
	if (!D)  return "";	//   no such variable

	char* item = D->w.userValue;
    if (!item)  return ""; // null value
	if ( D->word[1] == LOCALVAR_PREFIX && *item == LCLVARDATA_PREFIX && item[1] == LCLVARDATA_PREFIX) 
		item += 2; // skip `` marker

	if (dot) // json object
	{
		if (strncmp(item,"jo-",3)) return "";	// cannot be dotted
		D = FindWord(item);
		if (!D) return "";
		FACT* F = GetSubjectHead(D);
		WORDP DOT = FindWord(dot+1); // case sensitive find
		if (!DOT) return ""; // dont recognize such a name
		MEANING verb = MakeMeaning(DOT);
		while (F)
		{
			if (F->verb == verb) 
			{
				char* answer = Meaning2Word(F->object)->word;
				if (!strcmp(answer,"null")) return "";	// json null is our null
				return answer;
			}
			F = GetSubjectNext(F);
		}
		return "";	// not found null value
	}

    return (*item == '&') ? (item + 1) : item; //   value is quoted or not
 }

void ClearUserVariableSetFlags()
{
	for (unsigned int i = 0; i < userVariableIndex; ++i) RemoveInternalFlag(userVariableList[i],VAR_CHANGED);
}

void ShowChangedVariables()
{
	for (unsigned int i = 0; i < userVariableIndex; ++i) 
	{
		if (userVariableList[i]->internalBits & VAR_CHANGED)
		{
			char* value = userVariableList[i]->w.userValue;
			if (value && *value) Log(1,(char*)"%s = %s\r\n",userVariableList[i]->word,value);
			else Log(1,(char*)"%s = null\r\n",userVariableList[i]->word);
		}
	}
}

void PrepareVariableChange(WORDP D,char* word,bool init)
{
	if (!(D->internalBits & VAR_CHANGED))	// not changed already this volley
    {
		unsigned int i;
		for (i = 0; i < userVariableIndex; ++i)
		{
			if (userVariableList[i] == D) break;
		}
        if (i >= userVariableIndex) userVariableList[userVariableIndex++] = D;
        if (userVariableIndex == MAX_USER_VARS) // if too many variables, discard one (wont get written)  earliest ones historically get saved (like $cs_token etc)
        {
            --userVariableIndex;
            ReportBug((char*)"too many user vars at %s value: %s\r\n",D->word,word);
        }
		if (init) D->w.userValue = NULL; 
		D->internalBits |= VAR_CHANGED; // bypasses even locked preexisting variables
	}
}

void SetUserVariable(const char* var, char* word)
{
	char varname[MAX_WORD_SIZE];
	MakeLowerCopy(varname,(char*)var);
    WORDP D = StoreWord(varname);				// find or create the var.
	if (!D) return; // ran out of memory
	// adjust value
	if (word) // has a nonnull value?
	{
		if (!*word || !stricmp(word,(char*)"null") ) word = NULL; // really is null
		else //   some value 
		{
			size_t len = strlen(word);
			if (len > MAX_USERVAR_SIZE) 
			{
				word[MAX_USERVAR_SIZE] = 0; // limit on user vars same as match vars
				ReportBug((char*)"Too long user variable %s size %d assigning %s\r\n",var,len,word);
			}
			bool purelocal = (D->word[1] == LOCALVAR_PREFIX);
			word = AllocateString(word,len,1,false,purelocal); // we may be restoring old value which doesnt need allocation
			if (!word) return;
		}
	}

	PrepareVariableChange(D,word,true);
	
	if (planning && !documentMode) // handle undoable assignment (cannot use text sharing as done in document mode)
	{
		if (D->w.userValue == NULL) SpecialFact(MakeMeaning(D),(MEANING)1,0);
		else SpecialFact(MakeMeaning(D),(MEANING) (D->w.userValue - stringBase ),0);
	}
	D->w.userValue = word; 

	// tokencontrol changes are noticed by the engine
	if (!stricmp(var,(char*)"$cs_token")) 
	{
		int64 val = 0;
		if (word && *word) ReadInt64(word,val);
		else val = (DO_INTERJECTION_SPLITTING|DO_SUBSTITUTE_SYSTEM|DO_NUMBER_MERGE|DO_PROPERNAME_MERGE|DO_SPELLCHECK);
		tokenControl = val;
	}
	// responsecontrol changes are noticed by the engine
	else if (!stricmp(var,(char*)"$cs_response")) 
	{
		int64 val = 0;
		if (word && *word) ReadInt64(word,val);
		else val = ALL_RESPONSES;
		responseControl = (unsigned int)val;
	}	
	// wildcardseparator changes are noticed by the engine
	else if (!stricmp(var,(char*)"$cs_wildcardSeparator")) 
	{
		*wildcardSeparator = (*word == '"') ? word[1] : *word; // 1st char in string if need be
	}	
	if (trace == TRACE_VARIABLESET) Log(STDTRACELOG,(char*)"Var: %s -> %s\r\n",D->word,word);
	else if (D->internalBits & MACRO_TRACE) 
	{
		char pattern[100];
		char label[MAX_LABEL_SIZE];
		char* ptr = GetPattern(currentRule,label,pattern,100);  // go to output
		bool oldecho = echo;
		echo = true;
		Log(STDTRACELOG," Var: %s -> %s at topic %s.%d.%d %s %s\r\n",D->word,word, GetTopicName(currentTopicID),TOPLEVELID(currentRuleID),REJOINDERID(currentRuleID),label,pattern);
		echo = oldecho;
	}
}

void Add2UserVariable(char* var, char* moreValue,char* op,char* originalArg)
{
	// get original value
	char  minusflag = *op;
	char* oldValue;
    if (*var == '_') oldValue = GetwildcardText(GetWildcardID(var),true); // onto a wildcard
	else if (*var == USERVAR_PREFIX) oldValue = GetUserVariable(var); // onto user variable
	else if (*var == '^') oldValue = callArgumentList[atoi(var+1)+fnVarBase]; // onto function argument
	else return; // illegal

	// get augment value
	if (*moreValue == '_') moreValue = GetwildcardText(GetWildcardID(moreValue),true); 
	else if (*moreValue == USERVAR_PREFIX) moreValue = GetUserVariable(moreValue); 
	else if (*moreValue == '^') moreValue = callArgumentList[atoi(moreValue+1)+fnVarBase];

	// perform numeric op
	bool floating = false;
	if (strchr(oldValue,'.') || strchr(moreValue,'.') || *op == '/' ) floating = true; 
	char result[MAX_WORD_SIZE];

    if (floating)
    {
        float newval = (float)atof(oldValue);
		float more = (float)atof(moreValue);
        if (minusflag == '-') newval -= more;
        else if (minusflag == '*') newval *= more;
        else if (minusflag == '/') {
			if (more == 0) return; // cannot divide by 0
        	newval /= more;
        }
		else if (minusflag == '%') 
		{
			if (more == 0) return;
			int64 ivalue = (int64) newval;
			int64 morval = (int64) more;
			newval = (float) (ivalue % morval);
		}
        else newval += more;
        sprintf(result,(char*)"%1.2f",newval);
		char* at = strchr(result,'.');
		char* loc = at;
		while (*++at)
		{
			 if (*at != '0') break; // not pure
		}
		if (!*at) *loc = 0; // switch to integer
 		if (trace & TRACE_OUTPUT && CheckTopicTrace()) Log(STDTRACELOG,(char*)" %s   ",result);
    }
    else
    {
		int64 newval;
		ReadInt64(oldValue,newval);
		int64 more;
		ReadInt64(moreValue,more);
        if (minusflag == '-') newval -= more;
        else if (minusflag == '*') newval *= more;
        else if (minusflag == '/') 
		{
			if (more == 0)  return; // cannot divide by 0
			newval /= more;
		}
        else if (minusflag == '%') 
		{
			if (more == 0) return;
			newval %= more;
		}
        else if (minusflag == '|') 
		{
			newval |= more;
			if (op[1] == '^') newval ^= more;
		}
        else if (minusflag == '&') newval &= more;
        else if (minusflag == '^') newval ^= more;
        else if (minusflag == '<') newval <<= more;
		else if (minusflag == '>') newval >>= more;
		else newval += more;
		char tracex[MAX_WORD_SIZE];
#ifdef WIN32
		sprintf(result,(char*)"%I64d",newval); 
#else
		sprintf(result,(char*)"%lld",newval); 
#endif        
  		if (trace & TRACE_OUTPUT && CheckTopicTrace()) 
		{
			sprintf(tracex,"0x%016llx",newval);
			Log(STDTRACELOG,(char*)" %s/%s   ",result,tracex);
		}
	}

	// store result back
	if (*var == '_')  SetWildCard(result,result,var,0); 
	else if (*var == USERVAR_PREFIX) SetUserVariable(var,result);
	else if (*var == '^') strcpy(callArgumentList[atoi(var+1)+fnVarBase],result); 
}

void ReestablishBotVariables() // refresh bot variables in case user overwrote them
{
	for (unsigned int i = 0; i < botVariableIndex; ++i) botVariableList[i]->w.userValue = baseVariableValues[i];
}

void ClearBotVariables()
{
	botVariableIndex = 0;
}

void NoteBotVariables() // system defined variables
{
	for (unsigned int i = 0; i < userVariableIndex; ++i)
	{
		if (userVariableList[i]->word[1] != TRANSIENTVAR_PREFIX && userVariableList[i]->word[1] != LOCALVAR_PREFIX) // not a transient var
		{
			botVariableList[botVariableIndex] = userVariableList[i];
			baseVariableValues[botVariableIndex] = userVariableList[i]->w.userValue;
			++botVariableIndex;
		}
		RemoveInternalFlag(userVariableList[i],VAR_CHANGED);
	}
	userVariableIndex = 0;
}

void ClearUserVariables(char* above) 
{
	unsigned int count = userVariableIndex;
	while (count)
	{
		WORDP D = userVariableList[--count]; // 0 based
		if (!above || D->w.userValue < above) // string spaces runs DOWN, so this passes more recent entries into here
		{	
			D->w.userValue = NULL;
			RemoveInternalFlag(D,VAR_CHANGED);
			userVariableList[count] = userVariableList[--userVariableIndex]; // pack in if appropriate
		}
 	}
	if (!above) userVariableIndex = 0;
}

// This is the comparison function for the sort operation.
static int compareVariables(const void *var1, const void *var2)
{
	return strcmp((*(WORDP *)var1)->word, (*(WORDP *)var2)->word);
}

void DumpUserVariables()
{
	char* value;
	for (unsigned int i = 0; i < botVariableIndex; ++i) 
	{
		value = botVariableList[i]->w.userValue;
		if (value && *value)  Log(STDTRACELOG,(char*)"  bot variable: %s = %s\r\n",botVariableList[i]->word,value);
	}

	
	// Show the user variables in alphabetically sorted order.
	WORDP *arySortVariablesHelper;

	arySortVariablesHelper = (WORDP*) AllocateString(NULL,(userVariableIndex) ? userVariableIndex : 1, sizeof(WORDP));

	// Load the array.
	for (unsigned int i = 0; i < userVariableIndex; i++) arySortVariablesHelper[i] = userVariableList[i];

	// Sort it.
	qsort(arySortVariablesHelper, userVariableIndex, sizeof(WORDP), compareVariables);

	// Display the variables in sorted order.
	for (unsigned int i = 0; i < userVariableIndex; ++i)
	{
		WORDP D = arySortVariablesHelper[i];
		value = D->w.userValue;
		if (value && *value)
		{
			if (!stricmp(D->word, "$cs_token"))
			{
				Log(STDTRACELOG, "  variable: decoded %s = ", D->word);
				int64 val;
				ReadInt64(value, val);
				DumpTokenControls(val);

				Log(STDTRACELOG, "\r\n");
			}
			else Log(STDTRACELOG, "  variable: %s = %s\r\n", D->word, value);
		}
	}
	FreeBuffer();
}

char* PerformAssignment(char* word,char* ptr,FunctionResult &result,bool nojson)
{// assign to and from  $var, _var, ^var, @set, and %sysvar
    char op[MAX_WORD_SIZE];
	currentFact = NULL;					// No assignment can start with a fact lying around
	int oldImpliedSet = impliedSet;		// in case nested calls happen
	int oldImpliedWild = impliedWild;	// in case nested calls happen
    int assignFromWild = ALREADY_HANDLED;
	result = NOPROBLEM_BIT;
	impliedSet = ALREADY_HANDLED;
	
	if (*word == '^' && word[1] == '^' && IsDigit(word[2])) // indirect function variable assign
	{
		char* value = callArgumentList[atoi(word+2) + fnVarBase];
		if (*value == LCLVARDATA_PREFIX && value[1] == LCLVARDATA_PREFIX)//  not allowed to write indirect to caller arg
		{
			result = FAILRULE_BIT;
			return ptr;
		}
		strcpy(word,value); // change over to indirect to assign onto
		strcpy(word,GetUserVariable(word)); // now indirect thru him if we can
		if (!*word)
		{
			result = FAILRULE_BIT;
			return ptr;
		}
	}
	else if (*word == '^' && IsDigit(word[1])) // indirect function variable assign
	{
		char* value = callArgumentList[atoi(word+1) + fnVarBase];
		if (*value == LCLVARDATA_PREFIX && value[1] == LCLVARDATA_PREFIX)//  not allowed to write indirect to caller arg
		{
			result = FAILRULE_BIT;
			return ptr;
		}
		strcpy(word,value); // change over to assign onto caller var
	}

	if (*word == '@')
	{
		impliedSet = GetSetID(word);
		if (impliedSet == ILLEGAL_FACTSET)
		{
			result = FAILRULE_BIT;
			return ptr;
		}
	}
	impliedWild = ALREADY_HANDLED;
	if (*word == '_')  
	{
		impliedWild = GetWildcardID(word);	// if a wildcard save location
		if (impliedWild == ILLEGAL_MATCHVARIABLE) 
		{
			result = FAILRULE_BIT;
			return ptr;
		}
	}
	ChangeDepth(1,(char*)"PerformAssignment");
	char* word1 = AllocateBuffer();
	int setToImply = impliedSet; // what he originally requested
	int setToWild = impliedWild; // what he originally requested
	bool otherassign = (*word != '@') && (*word != '_');

	// Get assignment operator
    ptr = ReadCompiledWord(ptr,op); // assignment operator = += -= /= *= %= ^= |= &=
	impliedOp = *op;
	if (*op == '=' && impliedSet >= 0) SET_FACTSET_COUNT(impliedSet,0); // force to be empty for @0 = ^first(...)
	char originalWord1[MAX_WORD_SIZE];
	ReadCompiledWord(ptr,originalWord1);

	// get the from value
	assignFromWild =  (*ptr == '_' && IsDigit(ptr[1])) ? GetWildcardID(ptr)  : -1;
	if (assignFromWild >= 0 && *word == '_') ptr = ReadCompiledWord(ptr,word1); // assigning from wild to wild. Just copy across
	else
	{
		ptr = ReadCommandArg(ptr,word1,result,OUTPUT_NOTREALBUFFER|OUTPUT_NOCOMMANUMBER|ASSIGNMENT,MAX_BUFFER_SIZE); // need to see null assigned -- store raw numbers, not with commas, lest relations break
		if (*word1 == '#') // substitute a constant? user type-in :set command for example
		{
			uint64 n = FindValueByName(word1+1);
			if (!n) n = FindSystemValueByName(word1+1);
			if (n) 
			{
#ifdef WIN32
				sprintf(word1,(char*)"%I64d",(long long int) n); 
#else
				sprintf(word1,(char*)"%lld",(long long int) n); 
#endif	
			}
		}
		if (result & ENDCODES) goto exit;
		// impliedwild will be used up when spreading a fact by assigned. impliedset will get used up if assigning to a factset.
		// assigning to a var is simple
		// A fact was created but not used up by retrieving some field of it. Convert to a reference to fact.
		// if we already did a conversion into a set or wildcard, dont do it here. Otherwise do it now into those or $uservars.
		// DO NOT CHANGE TO add: if settowild != IMPLIED_WILD. that introduces a bug assigning to $vars.

		// if he original requested to assign to and the assignment has been done, then we dont need to do anything
		if ((setToImply != impliedSet && setToImply != ALREADY_HANDLED) || (setToWild != impliedWild  && setToWild != ALREADY_HANDLED) ) currentFact = NULL; // used up
		// A fact was created but not used up by retrieving some field of it. Convert to a reference to fact. -- eg $$f = createfact()
		else if (currentFact && setToImply == impliedSet && setToWild == impliedWild && (setToWild != ALREADY_HANDLED || setToImply != ALREADY_HANDLED || otherassign)) sprintf(word1,(char*)"%d",currentFactIndex());
	}
   	if (!stricmp(word1,(char*)"null")) *word1 = 0;

	//   now sort out who we are assigning into and if its arithmetic or simple assign
	if (*word == '@')
	{
		if (trace & TRACE_OUTPUT && CheckTopicTrace()) Log(STDTRACETABLOG,(char*)"%s(%s) %s %s => ",word,GetUserVariable(word),op,originalWord1);
		if (impliedSet == ALREADY_HANDLED){;}
		else if (!*word1 && *op == '=') // null assign to set as a whole
		{
			if (*originalWord1 == '^') {;} // presume its a factset function and it has done its job - @0 = next(fact @1fact)
			else
			{
				SET_FACTSET_COUNT(impliedSet,0);
				factSetNext[impliedSet] = 0;
			}
		}
		else if (*word1 == '@') // set to set operator
		{
			FACT* F;
			int rightSet = GetSetID(word1);
			if (rightSet == ILLEGAL_FACTSET) 
			{
				result = FAILRULE_BIT;
				impliedOp = 0;
				goto exit;
			}
			unsigned int rightCount =  FACTSET_COUNT(rightSet);
			unsigned int impliedCount =  FACTSET_COUNT(impliedSet); 

			if (*op == '+') while (rightCount) AddFact(impliedSet,factSet[rightSet][rightCount--]); // add set to set preserving order
			else if (*op == '-') // remove from set
			{
				for (unsigned int i = 1; i <= rightCount; ++i) factSet[rightSet][i]->flags |= MARKED_FACT; // mark right facts
				for (unsigned int i = 1; i <= impliedCount; ++i) // erase from the left side
				{ 
					F = factSet[impliedSet][i];
					if (F->flags & MARKED_FACT)
					{
						memmove(&factSet[impliedSet][i],&factSet[impliedSet][i+1], (impliedCount - i)* sizeof(FACT*));
						--impliedCount; // new end count
						--i; // redo loop at this point
					}
				}
				for (unsigned int i = 1; i <= rightCount; ++i) factSet[rightSet][i]->flags ^= MARKED_FACT; // erase marks
				SET_FACTSET_COUNT(impliedSet,impliedCount);
			}
			else if (*op == '=') memmove(&factSet[impliedSet][0],&factSet[rightSet][0], (rightCount+1) * sizeof(FACT*)); // assigned from set
			else result = FAILRULE_BIT;
		}
		else if (IsDigit(*word1) || !*word1) // fact index (or null fact) to set operators 
		{
			int index;
			ReadInt(word1,index);
			FACT* F = Index2Fact(index);
			unsigned int impliedCount =  FACTSET_COUNT(impliedSet); 
			if (*op == '+' && op[1] == '=' && !stricmp(originalWord1,(char*)"^query") ) {;} // add to set done directly @2 += ^query()
			else if (*op == '+') AddFact(impliedSet,F); // add to set
			else if (*op == '-') // remove from set
			{
				if (F) F->flags |= MARKED_FACT;
				for (unsigned int i = 1; i <= impliedCount; ++i) // erase from the left side
				{ 
					FACT* G = factSet[impliedSet][i];
					if ((G && G->flags & MARKED_FACT) || (!G && !F))
					{
						memmove(&factSet[impliedSet][i],&factSet[impliedSet][i+1], (impliedCount - i)* sizeof(FACT*) );
						--impliedCount;
						--i;
					}
				}
				SET_FACTSET_COUNT(impliedSet,impliedCount);
				F->flags ^= MARKED_FACT;
			}
			else if (*op == '=') // assign to set (cant do this with null because it erases the set)
			{
				SET_FACTSET_COUNT(impliedSet,0);
				AddFact(impliedSet,F);
			}
			else result = FAILRULE_BIT;
		}
		if (impliedSet != ALREADY_HANDLED)
		{
			factSetNext[impliedSet] = 0; // all changes requires a reset of next ptr
			impliedSet = ALREADY_HANDLED;
		}
	}
	else if (IsArithmeticOperator(op))  
	{
		if (trace & TRACE_OUTPUT && CheckTopicTrace()) 
		{
			if (*op == '=') Log(STDTRACETABLOG,(char*)"%s %s %s(%s) => ",word,op,originalWord1,GetUserVariable(originalWord1));
			else Log(STDTRACETABLOG,(char*)"%s(%s) %s %s(%s) => ",word,GetUserVariable(word),op,originalWord1,GetUserVariable(originalWord1));
		}
		if (*word == '^') result = FAILRULE_BIT;	// not allowed to increment locally at present...
		else if (*word == USERVAR_PREFIX && strchr(word,'.') && !nojson) result = FAILRULE_BIT; // illegal on json object insert
		else Add2UserVariable(word,word1,op,originalWord1);
	}
	else if (*word == '_') //   assign to wild card
	{
		if (impliedWild != ALREADY_HANDLED) // no one has actually done the assignnment yet
		{
			if (assignFromWild >= 0) // full tranfer of data
			{
				SetWildCard(wildcardOriginalText[assignFromWild],wildcardCanonicalText[assignFromWild],word,0); 
				wildcardPosition[GetWildcardID(word)] =  wildcardPosition[assignFromWild];
			}
			else SetWildCard(word1,word1,word,0); 
		}
		if (trace & TRACE_OUTPUT && CheckTopicTrace()) Log(STDTRACETABLOG,(char*)" %s = %s(%s)\r\n",word,originalWord1,word1);
	}
	else if (*word == USERVAR_PREFIX) 
	{
		if (trace & TRACE_OUTPUT && CheckTopicTrace()) Log(STDTRACETABLOG,(char*)" %s = %s(%s)\r\n",word,originalWord1,word1);
		char* dot = strchr(word,'.');
		if (!dot || nojson) SetUserVariable(word,word1);
#ifndef DISCARDJSON
		else result = JSONVariableAssign(word,dot,word1);// json object insert
#endif
	}
	else if (*word == '\'' && word[1] == USERVAR_PREFIX) 
	{
		if (trace & TRACE_OUTPUT && CheckTopicTrace()) Log(STDTRACETABLOG,(char*)" %s = %s(%s)\r\n",word,originalWord1,word1);
		SetUserVariable(word+1,word1); // '$xx = value  -- like passed thru as argument
	}
	else if (*word == SYSVAR_PREFIX) 
	{
		if (trace & TRACE_OUTPUT && CheckTopicTrace()) Log(STDTRACETABLOG,(char*)" %s = %s(%s)\r\n",word,originalWord1,word1);
		SystemVariable(word,word1);
	}
	else if (*word == '^') // overwrite function arg
	{
		if (trace & TRACE_OUTPUT && CheckTopicTrace()) Log(STDTRACETABLOG,(char*)" %s = %s\r\n",word,word1);
		callArgumentList[atoi(word+1)+fnVarBase] = AllocateInverseString(word1);
	}
	else // cannot touch a  word, or number
	{
		if (trace & TRACE_OUTPUT && CheckTopicTrace()) Log(STDTRACETABLOG,(char*)"illegal assignment to %s\r\n",word);
		result = FAILRULE_BIT;
		goto exit;
	}

	//  followup arithmetic operators?
	while (ptr && IsArithmeticOperator(ptr))
	{
		ptr = ReadCompiledWord(ptr,op);
		ReadCompiledWord(ptr,originalWord1);
		ptr = ReadCommandArg(ptr,word1,result,ASSIGNMENT); 
		if (!stricmp(word1,word)) 
		{
			result = FAILRULE_BIT;
			Log(STDTRACELOG,(char*)"variable assign %s has itself as a term\r\n",word);
		}
		if (result & ENDCODES) goto exit; // failed next value
		if (trace & TRACE_OUTPUT && CheckTopicTrace()) Log(STDTRACETABLOG,(char*)"    %s(%s) %s %s(%s) =>",word,GetUserVariable(word),op,originalWord1,word1);
		Add2UserVariable(word,word1,op,originalWord1);
		if (trace & TRACE_OUTPUT && CheckTopicTrace()) Log(STDTRACELOG,(char*)"\r\n");
	}

	// debug
	if (trace & TRACE_OUTPUT && CheckTopicTrace())
	{
		char* answer = AllocateBuffer();
		logUpdated = false;
		if (*word == '@') 
		{
			int set = GetSetID(word);
			int count = FACTSET_COUNT(set);
			FACT* F = factSet[set][count];
			unsigned int id = Fact2Index(F);
			char fact[MAX_WORD_SIZE];
			WriteFact(F,false,fact,false,false);
			sprintf(answer,(char*)"last value @%d[%d] is %d %s",set,count,id,fact ); // show last item in set
		}
		FreeBuffer();
	}
	
exit:
	currentFact = NULL; // any assignment uses up current fact by definition
	FreeBuffer();
	ChangeDepth(-1,(char*)"PerformAssignment");
	impliedSet = oldImpliedSet;
	impliedWild = oldImpliedWild;
	impliedOp = 0;
	return ptr;
}
