from django import forms

class LoginForm(forms.Form):
    username = forms.CharField(
        label="Username",
        label_suffix="",
        max_length=30,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control', 'name': 'username'}),
    )
    password = forms.CharField(
        label="Password",
        label_suffix="",
        max_length=30, 
        required=True,
        widget=forms.PasswordInput
    )