
guidedModel =// @startlock
{
	User :
	{
		entityMethods :
		{// @endlock
			validatePassword:function(password)
			{// @lock
				var ha1 = directory.computeHA1(this.ID, password);
				return (ha1 === this.HA1Key); //true if validated, false otherwise.
			}// @startlock
		},
		password :
		{
			onSet:function(value)
			{// @endlock
				this.HA1Key = directory.computeHA1(this.ID, value);
			},// @startlock
			onGet:function()
			{// @endlock
				return "*****"; //could also return Null.
			}// @startlock
		}
	}
};// @endlock
