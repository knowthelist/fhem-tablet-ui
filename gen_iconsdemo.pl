#!/usr/bin/perl

use strict;

my @cssfiles = qw(font-awesome.min.css openautomation.css fhemSVG.css material-icons.min.css weather-icons.min.css);
my $color='#f0f0f0';

my $html_head = '<!DOCTYPE html>
<html>
<head>
        <title>FHEM-Tablet-UI :: Iconfonts Demo</title>
        <script src="js/fhem-tablet-ui.js" defer></script>
';
$html_head .= '
</head>
<body style="background-color:#2a2a2a">
';

my $html_foot = '
</body>
</html>';


my $html_icons;
my $html_table;

foreach my $cssfile (@cssfiles) {
    $html_icons .= "\n    <h2>$cssfile</h2>\n";
    
    $html_table .= "<tr><th><h2 colspan='3'>$cssfile</h2></th></tr>\n";
    
    
    my %icons;

    open CSS, "www/tablet/lib/$cssfile"  or die $!;
    while(my $line = <CSS>) {
        $line =~ s/.path\d+//g;
        my @matches = $line =~ /\.([^.'";]*?):before/ig;
        for my $match (@matches) {
            $icons{$match}++;
        }
    }
    close CSS;
    
    my @icons = sort keys %icons;
    for my $icon (@icons) {
        $html_icons .= '        <div data-type="symbol" data-icon="'.$icon.'" title="'.$icon.'" data-off-color="'.$color.'"></div>'."\n";
        $html_table .= '        <tr><td><div data-type="symbol" data-icon="'.$icon.'" title="'.$icon.'" data-off-color="'.$color.'"></div></td><td>'.$icon.'</td><td>'.$cssfile.'</td></tr>'."\n";
    }
}

open HTML, '> icons.html';
print HTML $html_head;
print HTML $html_icons;
print HTML $html_foot;
close HTML;

open HTML, '> icons_table.html';
print HTML $html_head;
print HTML '<table>';
print HTML $html_table;
print HTML '</table>';
print HTML $html_foot;
close HTML;


print "Ok\n";
